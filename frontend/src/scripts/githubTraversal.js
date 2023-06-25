const fetch = require("node-fetch");
const NpmApi = require("npm-api");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fetchPackageJson(repos, token) {
  const headers = {
    Authorization: `token ${token}`,
  };

  const allDependencies = {};

  for (const { user, repo } of repos) {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/package.json`;

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileData = await response.json();
      const packageJson = JSON.parse(
        Buffer.from(fileData.content, "base64").toString()
      );
      Object.assign(
        allDependencies,
        packageJson.dependencies,
        packageJson.devDependencies
      );
    } catch (error) {
      console.error(
        `Error fetching package.json for repo "${repo}" of user "${user}": ${error.message}`
      );
    }
  }

  return allDependencies;
}

async function getDependenciesRecursively(dependencies, level = 1) {
  const npm = new NpmApi();
  const dependencyList = [];

  async function processDependency(name, currentLevel) {
    const existingDep = dependencyList.find((dep) => dep.dependency === name);

    if (existingDep) {
      existingDep.count += 1;
    } else {
      dependencyList.push({ dependency: name, count: 1 });
    }

    try {
      const repo = npm.repo(name);
      const pkg = await repo.package();
      const newDependencies = { ...pkg.dependencies, ...pkg.devDependencies };
      console.log(`Processing dependency "${name}" at level ${currentLevel}`);

      if (currentLevel < 3) {
        for (const newDep in newDependencies) {
          await processDependency(newDep, currentLevel + 1);
        }
      }
    } catch (error) {
      console.error(`Error processing dependency "${name}": ${error.message}`);
    }
  }

  for (const dep in dependencies) {
    await processDependency(dep, level);
  }
  return dependencyList;
}

async function saveDependenciesToDatabase(dependencies) {
  for (const dep of dependencies) {
    try {
      await prisma.project.create({
        data: {
          name: dep.dependency,
          isTest: false,
          metrics: {
            create: {
              metricType: "NUM_DEPENDANTS",
              value: dep.count,
            },
          },
        },
      });
      console.log(`Saved dependency ${dep.dependency} to the database.`);
    } catch (err) {
      console.error(`Failed to save dependency ${dep.dependency}: ${err}`);
    }
  }
}

(async () => {
  const initialDependencies = await fetchPackageJson(
    [
      { user: "AvinashNayak27", repo: "hackfs23" },
      { user: "mbcse", repo: "web3stash" },
      { user: "hfccr", repo: "hfs23" },
      { user: "george-hub331", repo: "clover-hackfs2023" },
      { user: "ozeliger", repo: "delta" },
      { user: "aaytuncc", repo: "HackFS-2023" },
      { user: "Akshit1311", repo: "hackfs-2023" },
      { user: "Manidills", repo: "E2A" },
      { user: "Ayushjain2205", repo: "hack-fs" },
      { user: "Dhruv-2003", repo: "hackfs-2023" },
      { user: "hrsh22", repo: "mintlock" },
      { user: "RaviMauryaHootowl", repo: "Tribe-HackFS" },
      { user: "aarav1656", repo: "ethglobal" },
      { user: "TeodorescuCostin", repo: "hackFS-2023" },
      { user: "Shiyasmohd", repo: "web3-email" },
      { user: "aeither", repo: "fil-frens" },
      { user: "Harsh2220", repo: "DeBlog" },
      { user: "Ahmed-Aghadi", repo: "The-Dao" },
      { user: "MarbleLeaf", repo: "LoadRunner" },
      { user: "zkNetcast", repo: "netcast" },
    ],
    // [
    //   { user: "coreymjames", repo: "open-ie" },
    //   { user: "Kiernan-G", repo: "eth-waterloo" },
    //   { user: "trillaboi", repo: "starlight" },
    //   { user: "pratikdahal105", repo: "everest_hackathon" },
    //   { user: "gedithejedi", repo: "anonicard" },
    //   { user: "tbdeath", repo: "frontend" },
    //   { user: "tbdeath", repo: "backend" },
    //   { user: "slashweb", repo: "me-emergency-scan" },
    // ],
    // [{ user: "node-fetch", repo: "fetch-blob" }],
    // [
    //   { user: "davidedantonio", repo: "fastify-axios" },
    //   { user: "jkrems", repo: "babel-tap" },
    // ],
    process.env.NEXT_PUBLIC_GITHUB_API_KEY
  );

  const allDependencies = await getDependenciesRecursively(
    initialDependencies,
    1
  );
  console.log(allDependencies);

  await saveDependenciesToDatabase(allDependencies);

  await prisma.$disconnect();
})();
