sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.GenreEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("GenreEdit");
                
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
                    Spras: this.getView().byId("GenreTranslationLanguageText").getValue(),
                    Name: this.getView().byId("GenreTranslationNameinput").getValue(),
                    Description: this.getView().byId("GenreTranslationDescriptioninput").getValue()
                }

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show("Language cannot be empty");
                    }
                    else if (translation.Name === ""){
                        sap.m.MessageToast.show("Name cannot be empty");
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show("Description cannot be empty");
                    }
                    else{
                        await Service.updateGenreText(this.getOwnerComponent().getModel(), translation);

                        this.getView().getModel().submitChanges({
                            success: () => {
                                sap.m.MessageToast.show("Successfully saved!");
                        
                                this.getOwnerComponent().getModel().refresh(true);

                                this.onNavBack();
                            },
                            error: (oError) => {
                                sap.m.MessageToast.show(this.getErrorMessage(oError));
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

            onDeletePressed: function(oEvent){
                    const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    let sText = oResourceBundle.getText("deleteQuestion"); //"{i18n>deleteQuestion}"; => to działa

                    let genreid = oEvent.getSource().getBindingContext().getProperty("Genreid");
                    let spras = this.getView().byId("GenreTranslationLanguageText").getValue();

                    

                    MessageBox.confirm(sText, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: (sAction) => {
                            if (MessageBox.Action.YES === sAction) {
                                Service.deleteGenreText(this.getOwnerComponent().getModel(), genreid, spras)
                                .then(() => {
                                    sText = oResourceBundle.getText("Success");
                                    sap.m.MessageToast.show(sText)
                                })
                                .catch((oError) => {
                                    sap.m.MessageToast.show(this.getErrorMessage(oError))
                                });
                            }
                        }
                    })
                
            },
        });
    });