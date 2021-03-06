//@ts-check

const path = require("path");
const fs = require("fs");

const chalk = require("chalk").default;
const express = require("express");
const sharp = require("sharp");
const compression = require("compression");
const morgan = require("morgan");
const cache = require("node-file-cache").create();
const debug = require('debug')('comics:server');

const {
  ensureDir,
  sanitizeBaseUrl,
  returnJsonNoCache,
  getUser
} = require("./utils");
const { getFile, getPages } = require("./books");
const IndexCreator = require("./tree/IndexCreator");
const Walker = require("./tree/Walker");
const config = require("../../config");
const layout = require("./template");
const db = require("./db");

const error = chalk.red;
const title = chalk.underline.bold;

const comicsIndex = new IndexCreator(config.comics);
const BASE = sanitizeBaseUrl(process.env.COMICS_BASE);
const app = express();

app.use(compression()); // Enable Gzip
app.use(morgan("tiny")); // Access logs

// Static assets
app.use("/static", express.static("static"));
app.use("/images", express.static("images"));

// Pages that return the main layout,
// might be custom server rendered later
app.get("/", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);
app.get("/book/*", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);
app.get("/list/*", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);

app.get("/manifest.json", (req, res) => {
  const manifest = require("../manifest.json");
  manifest.start_url = BASE;
  manifest.icons = manifest.icons.map(icon => {
    icon.src = BASE + icon.src;
    return icon;
  });

  res.json(manifest);
});

app.get(/\/thumb\/([0-9])\/(.*)/, async (req, res) => {
  const ratio = req.param[0];
  const book = req.params[1];

  let node;
  try {
    node = await comicsIndex.getNode(book);
  } catch (e) {
    res.status(404).send("Book not found");
    return;
  }

  let image = node.getThumb();

  if (!image) {
    res.status(404).send("Thumb not found");
    return;
  }

  if (ratio !== 1) {
    image = image.replace(/(\.[A-z]{3,4}\/?(\?.*)?)$/, `@${ratio}x$1`);
  }

  const file = `cache/thumb/${node.getThumb()}`;
  const storedFile = path.join(config.comics, file);

  fs.exists(storedFile, exists => {
    if (exists) {
      res.sendFile(storedFile);
    } else {
      res.redirect(`${BASE}images/${file.replace(/#/g, "%23")}`);
    }
  });
});

app.get("/api/books", async (req, res) => {
  const walker = new Walker(await comicsIndex.getList());

  res.json(walker.toJson());
});

app.get("/api/read", (req, res) => {
  const user = getUser(req);
  const read = db.getRead(user);

  returnJsonNoCache(res, read);
});

app.post(/\/api\/read\/(.*)/, (req, res) => {
  const book = req.params[0];
  const user = getUser(req);
  const read = db.markRead(user, book);

  returnJsonNoCache(res, read);
});

app.get(/\/api\/books\/(.*)/, async (req, res) => {
  const book = req.params[0];
  const dirPath = path.join(config.comics, book);
  const key = `BOOK_${dirPath}`;

  const pagesFromCache = cache.get(key);

  if (pagesFromCache) {
    returnJsonNoCache(res, pagesFromCache);
    return;
  }

  const pages = await getPages(dirPath);
  cache.set(key, pages);
  returnJsonNoCache(res, pages);
});

app.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, async (req, res) => {
  const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)/;
  const presetName = req.params[0];
  const requestedFile = req.params[1];
  let sourceFile = requestedFile;

  debug(title("Generating Image"), req.params[0], req.params[1]);

  if (!config.sizes.hasOwnProperty(presetName)) {
    res.status(404).send("Preset not found");
    return;
  }

  // Clone preset if it has to be retinafied
  const preset = Object.assign({}, config.sizes[presetName]);

  // Retinafy preset
  if (retinaRegex.test(requestedFile)) {
    const matches = retinaRegex.exec(requestedFile);
    sourceFile = `${matches[1]}.${matches[2]}`;

    preset.width = preset.width ? preset.width * 2 : null;
    preset.height = preset.height ? preset.height * 2 : null;
  }

  const destination = path.join(
    config.comics,
    "cache",
    presetName,
    requestedFile
  );

  await ensureDir(path.dirname(destination));

  let file;
  try {
    file = await getFile(path.join(config.comics, sourceFile));
  } catch (e) {
    console.error(error("Cannot find image"), e);
    res.status(404).send("Could not find image");
    return;
  }

  try {
    await sharp(file.path)
      .resize(preset.width || null, preset.height || null)
      .toFile(destination);

    file.cleanup();
    res.sendFile(destination);
  } catch (e) {
    console.error(error("Failed compression"), e);
    file.cleanup();
    res.status(500).send("Could not compress image");
  }
});

console.log(title("Generating index"));
comicsIndex.getList().then(
  () => {
    console.log(title("Starting server"));
    if (BASE === "/") {
      app.listen(config.port);
    } else {
      // If we have a custom basepath, wrap our application as a
      // sub application with the basepath set to the main route.
      const outerApp = express();
      outerApp.use(BASE.replace(/\/+$/, ""), app);
      outerApp.listen(config.port);
    }

    console.log(
      title(`Started server on port ${config.port} with baseurl ${BASE}`)
    );
  },
  e => {
    console.error(error("Could not create index"), e);
  }
);

process.on("unhandledRejection", e => {
  console.error(error("unhandledRejection"), e.message, e.stack);
});
