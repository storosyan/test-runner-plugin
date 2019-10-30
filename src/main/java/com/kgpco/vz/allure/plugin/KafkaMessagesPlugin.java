package com.kgpco.vz.allure.plugin;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.List;

import io.qameta.allure.Aggregator;
import io.qameta.allure.core.Configuration;
import io.qameta.allure.core.LaunchResults;
public class KafkaMessagesPlugin implements Aggregator {

	@Override
	public void aggregate(final Configuration configuration,
			final List<LaunchResults> launches,
			final Path outputDirectory) throws IOException {
		final Path dataFolder = Files.createDirectories(outputDirectory.resolve("data"));
		final Path dataFile = dataFolder.resolve("testDiscoveryNew.json");
		System.out.println("DataPath:" + dataFile.toString());
		ProcessBuilder processBuilder = new ProcessBuilder();
		System.out.println("Invoke Kafka messages");
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
		final Path stateFilePath = dataFolder.resolve("testRunnerState.json");
		try {
			Files.createFile(stateFilePath);
			String stateFileDefaultContent = "{\n" + 
					"    \"exec\":{\n" + 
					"        \"host\":\"http://10.100.16.76\",\n" + 
					"        \"clean\":false\n" + 
					"    },\n" + 
					"    \"tags\":[\n" + 
					"        {\"name\":\"negative\",\"state\":\"\"},\n" + 
					"        {\"name\":\"demo79\",\"state\":\"\"},\n" + 
					"        {\"name\":\"login\",\"state\":\"\"},\n" + 
					"        {\"name\":\"nodemoready\",\"state\":\"\"},\n" + 
					"        {\"name\":\"inactive\",\"state\":\"\"},\n" + 
					"        {\"name\":\"usecase3\",\"state\":\"\"},\n" + 
					"        {\"name\":\"demoready\",\"state\":\"\"},\n" + 
					"        {\"name\":\"demo7\",\"state\":\"\"},\n" + 
					"        {\"name\":\"positive\",\"state\":\"\"},\n" + 
					"        {\"name\":\"usecase\",\"state\":\"\"}\n" + 
					"    ],\n" + 
					"    \"tests\":{\n" + 
					"        \"packages\":[],\n" + 
					"        \"classes\":[],\n" + 
					"        \"methods\":[\"Environment Configuration Test\"]\n" + 
					"    }\n" + 
					"}";
			Files.write(stateFilePath, stateFileDefaultContent.getBytes());
		} catch (Exception ignore) {
		}
	}

}
