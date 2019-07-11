package com.kgpco.vz.allure.plugin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import io.qameta.allure.Aggregator;
import io.qameta.allure.core.Configuration;
import io.qameta.allure.core.LaunchResults;

public class TestRunnerPlugin implements Aggregator {

	@Override
	public void aggregate(final Configuration configuration,
			final List<LaunchResults> launches,
			final Path outputDirectory) throws IOException {
		final Path dataFolder = Files.createDirectories(outputDirectory.resolve("data"));
		final Path dataFile = dataFolder.resolve("testDiscovery.json");
		System.out.println("DataPath:" + dataFile.toString());
		ProcessBuilder processBuilder = new ProcessBuilder();
		System.out.println("Invoke Test discovery");
		processBuilder.inheritIO().command(
				"java", 
				"-jar", 
				"/Users/simon/Development/jtas/vertex/target/vertex-0.0.1-SNAPSHOT-jar-with-dependencies.jar",
				"testnames.generate.path=" + dataFile.toString());
		System.out.println(processBuilder.toString());
		try {

			Process process = processBuilder.start();

			int exitCode = process.waitFor();
			System.out.println("\nExited with error code : " + exitCode);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}
