import fetch from "node-fetch";
import NpmApi from "npm-api";
import * as fs from "fs";

interface Repo {
  user: string;
  repo: string;
}

interface Dependency {
  dependency: string;
  count: number;
}

async function fetchPackageJson(
  repos: Repo[],
  token: string
): Promise<Dependency[]> {
  const headers = {
    Authorization: `token ${token}`,
  };

  const allDependencies: Dependency[] = [];

  for (const { user, repo } of repos) {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/package.json`;

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileData = (await response.json()) as { content: string };
      const packageJson = JSON.parse(
        Buffer.from(fileData.content, "base64").toString()
      );
      Object.assign(allDependencies, packageJson.dependencies);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error fetching package.json for repo "${repo}" of user "${user}": ${error.message}`
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  return allDependencies;
}

async function getDependenciesRecursively(
  dependencies: Dependency[],
  level = 1
): Promise<Dependency[]> {
  const npm = new NpmApi();
  const dependencyList: Dependency[] = [];

  async function processDependency(
    name: string,
    currentLevel: number
  ): Promise<void> {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error processing dependency "${name}": ${error.message}`
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  for (const dep in dependencies) {
    await processDependency(dep, level);
  }
  fs.writeFile(
    "dependencyList.json",
    JSON.stringify(dependencyList, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving dependencyList to file:", err);
      } else {
        console.log("Saved dependencyList to dependencyList.json");
      }
    }
  );

  return dependencyList;
}

(async () => {
  const initialDependencies = await fetchPackageJson(
    [{ user: "node-fetch", repo: "fetch-blob" }],
    // [
    //   { user: "davidedantonio", repo: "fastify-axios" },
    //   { user: "jkrems", repo: "babel-tap" },
    // ],
    process.env.NEXT_PUBLIC_GITHUB_API_KEY!
  );

  const allDependencies = await getDependenciesRecursively(
    initialDependencies,
    1
  );
  console.log(allDependencies);
})();
