sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, DateFormat, Service){
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
                            error: () => {
                                sap.m.MessageToast.show("An error occured!");
                            }
                        })
                    }
                } catch (oError) {
                    sap.m.MessageToast.show(oError);
                }

                
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            },

            onDeletePressed: function(oEvent){
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion");

                    let genreid = oEvent.getSource().getBindingContext().getProperty("Genreid");
                    let spras = this.getView().byId("GenreTranslationLanguageText").getValue();

                    Service.deleteGenreText(this.getOwnerComponent().getModel(), genreid, spras)
                    .then(() => {
                      console.log("log")
                      sap.m.MessageBox.success("asdfsdf")
                      })
                    .catch((oError) => {
                      console.log("log")
                      sap.m.MessageBox.success("oError")
                    });

                    // MessageBox.confirm(sText, {
                    //     actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    //     emphasizedAction: MessageBox.Action.YES,
                    //     onClose: (sAction) => {
                    //         if (MessageBox.Action.YES === sAction) {

                            // try{
                                
                                
    
                                // this.getView().getModel().submitChanges({
                                //     success: () => {
                                //         sap.m.MessageToast.show("Successfully deleted!");
                                        
                                //         this.getOwnerComponent().getModel().refresh(true);
                
                                //         //this.onNavBack();
                                //     },
                                //     error: () => {
                                //         sap.m.MessageToast.show("An error occured!");
                                //     }
                                // })
                            // } catch (oError) {
                            //     sap.m.MessageToast(oError)
                            // }
                    //         }
                    //     }
                    // })
                
            },
        });
    });