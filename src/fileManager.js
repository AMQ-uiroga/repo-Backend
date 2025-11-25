const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

const dataDir = path.join(__dirname, '../data');

function filePath(fileName) {
  return path.join(dataDir, fileName);
}

async function readJSON(fileName) {
  const p = filePath(fileName);
  try {
    const content = await fs.readFile(p, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJSON(fileName, []);
      return [];
    }
    throw err;
  }
}

async function writeJSON(fileName, data) {
  const p = filePath(fileName);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}

function generateUniqueId(existing) {
  let id =0;
  do {
    id++;
  } while (existing && existing.find((it) => String(it.id) === String(id)));
  return id;
}

module.exports = { readJSON, writeJSON, generateUniqueId };

