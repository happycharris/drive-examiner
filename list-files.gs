var counter = 0;

function onInstall(e) {
  onOpen(e);
}


function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('GDrive Folder Audit')
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
     clearSheet();

}


function showSidebar() {
   var html = HtmlService.createHtmlOutputFromFile('Search.html')
      .setTitle('List Files')
      .setWidth(300);
   SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
  SpreadsheetApp.getActiveSheet().appendRow(["Folder Name", "File Name", "File Owner", "File Permissions","Editors","Viewers", "File Path", "File Url"]);

}



function storeInput(valuefromHTMLFile) {

   var userInput = valuefromHTMLFile;

   passValueToSearch(userInput);

}


 function passValueToSearch(userInput) {

       var ID = userInput;
       counter = 0;
       fileCounter = 0;
       folderID(ID,counter);


   }


function folderID(ID,counter) {
//   Logger.log(ID);
   returnFileCount();
   var currfolder;
   var currfolder = DriveApp.getFolderById(ID);
   var name = currfolder.getName();
   var files = currfolder.getFiles();
   var subFiles;
   var childfolders = currfolder.getFolders();

//   Logger.log(counter);

  if (counter == 0){


    listFilesfromParent(childfolders,files,name,currfolder,subFiles,ID,counter);
  }
  else{

    listFiles(childfolders,files,name,currfolder,subFiles,ID);
  }


}



function listFilesfromParent(childfolders,files,name,currfolder,subFiles,ID,counter,editors)   {

    while (files.hasNext()) {

      var i;
      var File = files.next();

      SpreadsheetApp.getActiveSheet().appendRow([name, File.getName(), File.getOwner().getName(),File.getSharingAccess(), getEditors(File), getViewers(File), getPath(File), File.getUrl()]);
        Logger.clear();
  }
  counter++;
  folderID(ID,counter);
}



function listFiles(childfolders,files,name,currfolder,subFiles,editors){
    var data;

   /* Then for each folder, reach into it's sub-folders and grab all files and list them*/
   while (childfolders.hasNext()){


     subFiles = childfolders.next().getFiles();


     while (subFiles.hasNext()){

       var i;
       var File = subFiles.next();

      SpreadsheetApp.getActiveSheet().appendRow([name, File.getName(), File.getOwner().getName(),File.getSharingAccess(), getEditors(File), getViewers(File), getPath(File), File.getUrl()]);
         Logger.clear();

    }

  }

    getChildID(currfolder,files,name);

}




function getChildID(currfolder,files,name){

  var children = currfolder.getFolders();


     while (children.hasNext()){
     currfolder = children.next().getId();
     folderID(currfolder);
     }

}



function returnFileCount() {

    var fileCount = SpreadsheetApp.getActiveSheet().getLastRow();
    var fileCounter = fileCount + " files audited so far";
    return fileCounter;
}


function getEditors(File) {

  // Log the names of all users who have edit access to a file.
 var editors = File.getEditors();
 var name;
 var array = [];



 for (var i = 0; i < editors.length; i++) {


   name = editors[i].getName();
   array.push(name);
    }

  return array.toString();

}




function getViewers(File) {

  // Log the names of all users who have edit access to a file.
 var viewers = File.getViewers();
 var name;
 var array = [];



 for (var i = 0; i < viewers.length; i++) {


   name = viewers[i].getName();
   array.push(name);
    }

  return array.toString();

}


function getPath(File) {

  // Log the names of all users who have edit access to a file.
 var parents = File.getParents();
 var name;
 var array = [];
 var parent;



    while (parents.hasNext()) {

      parent = parents.next();
      name = parent.getName();
      array.push(name);
      parents = parent.getParents();
    }

   return array.reverse().join(" / ");

}