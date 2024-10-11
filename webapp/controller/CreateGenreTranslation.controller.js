sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.CreateGenreTranslation", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("CreateGenreTranslation");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(oEvent){
                const translation = {
                    Genreid: oEvent.getSource().getBindingContext().getProperty("Genreid"),
                    Spras: this.getView().byId("CreateGenreTranslation_LanguageComboBox").getSelectedKey(),
                    Name: this.getView().byId("CreateGenreTranslationNameinput").getValue(),
                    Description: this.getView().byId("CreateGenreTranslationDescriptioninput").getValue()
                }

                try{
                    console.log(translation)
                    // if (translation.Spras === "") {
                    //     sap.m.MessageToast.show("Language cannot be empty");
                    // }
                    // else if (translation.Name === ""){
                    //     sap.m.MessageToast.show("Name cannot be empty");
                    // }
                    // else if (translation.Description === ""){
                    //     sap.m.MessageToast.show("Description cannot be empty");
                    // }
                    // else{
                    //     await Service.createGenreText(this.getOwnerComponent().getModel(), translation);

                    //     this.getView().getModel().submitChanges({
                    //         success: () => {
                    //             sap.m.MessageToast.show("Successfully saved!");
                        
                    //             this.getOwnerComponent().getModel().refresh(true);

                    //             this.onNavBack();
                    //         },
                    //         error: () => {
                    //             sap.m.MessageToast.show("An error occured!");
                    //         }
                    //     })
                    // }
                } catch (oError) {
                    sap.m.MessageToast.show(oError);
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
                                    sap.m.MessageToast.show("An error occured!");
                                }
                            })
                        }
                    }
                })
            },
        });
    });