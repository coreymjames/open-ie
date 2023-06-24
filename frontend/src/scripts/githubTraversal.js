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
      Object.assign(allDependencies, packageJson.dependencies);
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
          isTest: true,
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
    [{ user: "node-fetch", repo: "fetch-blob" }],
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
