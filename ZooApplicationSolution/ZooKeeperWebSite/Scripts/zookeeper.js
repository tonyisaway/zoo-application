﻿function getAnimalFromForm() {
    var animalId = document.getElementById("animal-form-id").value;
    var animalName = document.getElementById("animal-form-name").value;
    var animalDateOfBirth = document.getElementById("animal-form-date-of-birth").value;

    var animal = { id: animalId, name: animalName, dateofbirth: animalDateOfBirth };
    return animal;
}

function refreshAnimalsView() {
    getAnimals(getAnimalsCallBack);
}

function displayAnimalsView() {
    refreshAnimalsView();
    document.getElementById("animals-view").style.visibility = 'visible';
}

function animalAddNewButtonOnClick() {
    displayAddNewAnimalForm()
}

function animalFormDeleteButtonOnClick() {
    var animal = getAnimalFromForm();
    var animalId = animal.id;
    deleteAnimal(animalId, deleteAnimalCallBack);
}

function initaliseAddNewButton() {
    var animalAddNewButton = document.getElementById("animal-add-new-button");
    animalAddNewButton.addEventListener("click", animalAddNewButtonOnClick);
}

function intialiseDeleteButton() {
    var animalFormDeleteButton = document.getElementById("animal-form-delete-button");
    animalFormDeleteButton.addEventListener("click", animalFormDeleteButtonOnClick);
}

function refreshEditAnimalForm() {
    var animal = getAnimalFromForm();
    getAnimal(animal.id, getAnimalCallBack);
}

function animalFormReset() {
    document.getElementById("animal-form").reset();
}

function displayAddNewAnimalForm() {
    animalFormReset();
    document.getElementById("animal-form-save-button").removeAttribute("onclick");
    document.getElementById("animal-form-save-button").setAttribute("onclick", "postAnimal(postAnimalCallBack); return false;");
    document.getElementById("animal-form-view").style.visibility = 'visible';
    document.getElementById("animal-form-delete-button").style.visibility = 'hidden';
}

function displayEditAnimalForm(animalModel) {
    animalFormBind(animalModel)
    document.getElementById("animal-form-save-button").removeAttribute("onclick");
    document.getElementById("animal-form-save-button").setAttribute("onclick", "putAnimal(putAnimalCallBack); return false;");
    document.getElementById("animal-form-view").style.visibility = 'visible';
    document.getElementById("animal-form-delete-button").style.visibility = 'visible';
}

function animalFormBind(animalModel) {
    animalFormReset();
    document.getElementById("animal-form-id").value = animalModel.Id;
    document.getElementById("animal-form-name").value = animalModel.Name;
    document.getElementById("animal-form-date-of-birth").value = animalModel.DateOfBirth;
}

function getAnimalCallBack(responseText) {
    var animalModel = JSON.parse(responseText);
    displayEditAnimalForm(animalModel);
}

function postAnimalCallBack(responseText) {
    refreshAnimalsView();
    displayAddNewAnimalForm();
    //var animalFormFeedback = document.getElementById("animal-form-feedback");
}

function putAnimalCallBack(responseText) {
    refreshAnimalsView();
    refreshEditAnimalForm();
    //var animalFormFeedback = document.getElementById("animal-form-feedback");
}

function deleteAnimalCallBack(responseText) {
    refreshAnimalsView();
    displayAddNewAnimalForm();
    //var animalFormFeedback = document.getElementById("animal-form-feedback");
}

function getAnimalsCallBack(responseText) {

    var animalModels = JSON.parse(responseText);
    var animalsList = document.getElementById("animals-list");
    animalsList.innerHTML = "";

    for (var i = 0; i < animalModels.length; i++) {
        var animalModel = animalModels[i];

        var link = document.createElement("a");
        var linkText = document.createTextNode(animalModel.Name);
        link.appendChild(linkText);
        link.setAttribute("onclick", "getAnimal('" + animalModel.Id + "', getAnimalCallBack); return false;");
        link.href = "#";

        var li = document.createElement("li");
        li.appendChild(link);
        animalsList.appendChild(li);
    }
}

function sendGetRequest(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();

    return request.responseText;
}

function sendJsonStringOnRequest(type, url, jsonString, callBack) {
    var request = new XMLHttpRequest();
    request.open(type, url)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
        if (request.status === 200) {
            callBack(request.responseText);
        }
    };

    request.send(jsonString);
}

function getAnimal(id, callBack) {
    var url = baseAddress + "api/Animal/" + id;
    var responseText = sendGetRequest(url);
    callBack(responseText);
}

function postAnimal(callBack) {
    var type = "POST";
    var url = baseAddress + "api/Animal/";

    var animal = getAnimalFromForm();
    var jsonString = JSON.stringify(animal);

    sendJsonStringOnRequest(type, url, jsonString, callBack);
}

function putAnimal(callBack) {
    var animal = getAnimalFromForm();

    var type = "PUT";
    var url = baseAddress + "api/Animal/" + animal.id;
    var jsonString = JSON.stringify(animal);

    sendJsonStringOnRequest(type, url, jsonString, callBack);
}

function deleteAnimal(id, callBack) {
    var request = new XMLHttpRequest();
    request.open("DELETE", baseAddress + "api/Animal/" + id, false);
    request.send();

    callBack(request.responseText);
}

function getAnimals(callBack) {
    var url = baseAddress + "api/Animals/";
    var responseText = sendGetRequest(url);
    callBack(responseText);
}
