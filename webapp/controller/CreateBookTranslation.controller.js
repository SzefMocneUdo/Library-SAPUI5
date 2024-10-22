sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.CreateBookTranslation", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("CreateBookTranslation");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(oEvent){
                const translation = {
                    ISBN: oEvent.getSource().getBindingContext().getProperty("ISBN"),
                    Spras: this.getView().byId("CreateBookTranslation_LanguageComboBox").getSelectedKey(),
                    Title: this.getView().byId("CreateBookTranslationTitleinput").getValue(),
                    Description: this.getView().byId("CreateBookTranslationDescriptioninput").getValue()
                }

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show("Language cannot be empty");
                    }
                    else if (translation.Title === ""){
                        sap.m.MessageToast.show("Title cannot be empty");
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show("Description cannot be empty");
                    }
                    else{
                        await Service.createBookText(this.getOwnerComponent().getModel(), translation);

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
            }
        });
    });