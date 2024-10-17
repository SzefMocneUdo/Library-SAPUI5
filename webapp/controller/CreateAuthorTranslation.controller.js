sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.CreateAuthorTranslation", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("CreateAuthorTranslation");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(oEvent){
                const translation = {
                    Authorid: oEvent.getSource().getBindingContext().getProperty("Authorid"),
                    Spras: this.getView().byId("CreateAuthorTranslation_LanguageComboBox").getSelectedKey(),
                    Name: this.getView().byId("CreateAuthorTranslationNameinput").getValue(),
                    Surname: this.getView().byId("CreateAuthorTranslationSurnameinput").getValue(),
                    Description: this.getView().byId("CreateAuthorTranslationDescriptioninput").getValue()
                }

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show("Language cannot be empty");
                    }
                    else if (translation.Name === ""){
                        sap.m.MessageToast.show("Name cannot be empty");
                    }
                    else if (translation.Surname === ""){
                        sap.m.MessageToast.show("Name cannot be empty");
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show("Description cannot be empty");
                    }
                    else{
                        await Service.createAuthorText(this.getOwnerComponent().getModel(), translation);

                        this.getView().getModel().submitChanges({
                            success: () => {
                                sap.m.MessageToast.show("Successfully saved!");
                        
                                this.getOwnerComponent().getModel().refresh(true);

                                this.onNavBack();
                            },
                            error: () => {
                                sap.m.MessageToast.show("An error occured!");
                            }
                        })
                    }
                } catch (oError) {
                    sap.m.MessageToast.show(this.getErrorMessage(oError));
                }
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            },

            onDeletePressed: function(){
                let sPath = this.getView().getElementBinding().getPath(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion");

                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            this.getView().getModel().remove(sPath, {
                                success: () => {
                                    this.onNavBack();
                                },
                                error: (oError) => {
                                    sap.m.MessageToast.show(this.getErrorMessage(oError));
                                }
                            })
                        }
                    }
                })
            },
        });
    });