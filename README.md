#Commands to run/start Allure
##In two steps
allure generate -c allure-results/ -o allure-report/  
allure open allure-report/ -p 3333  
##In one step
allure serve allure-results/ -p 3333  

Note: remember, when run allure generate the allure-report folder will be overwritten 
and you will use all your local changes in allure-report/plugins/yourplugin/ folder 
(index.js etc.)  

