# Commands to run/start Allure  
## In two steps  
allure generate -c allure-results/ -o allure-report/  
allure open allure-report/ -p 3333  
## In one step  
allure serve allure-results/ -p 3333  

Note: remember, when run allure generate the allure-report folder will be overwritten 
and you will loose all your local changes in allure-report/plugins/yourplugin/ folder 
(index.js etc.)  

# Plugin distribution  
  
https://docs.qameta.io/allure/#_allure_plugins_system  

Build the plugin my running  
mvn package  
from the root folder of the plugin..
When you build a plugin, you should come up with the following structure:  
'''bash
my-plugin  
├── target  
│   └── test-runner-plugin-0.0.1-SNAPSHOT.jar  
└── src  
    └── dist  
        ├── allure-plugin.yml  
        └── static  
            ├── testexecutor.css  
            └── index.js 
'''
The content of the /dist folder and the jar file must be copied into plugins folder of the commandline distribution. 
'''bash
allure-commandline  
├── bin  
├── config  
│   └── allure.yml  
├── lib  
└── plugins  
    ├── behaviors-plugin  
    ├── junit-plugin  
    ├── ...  
    ├── test-runner-plugin  
    └── ...  
'''

Add the plugin folder name to default build profile configuration file`/config/allure.yml`. 

plugins:  
  - behaviors-plugin  
  - junit-plugin  
  - screen-diff-plugin  
  ...
  - test-runner-plugin


