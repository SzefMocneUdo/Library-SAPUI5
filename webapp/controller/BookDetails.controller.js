sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat"
],

    function (Base, JSONModel, Fragment, MessageBox, History, DateFormat){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookDetails", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookDetails");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },


            onEditPressed: function(oEvent){

                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("BookEdit", {
                    path: encodeURIComponent(path)
                });
            },

            onSavePressed: async function(){

                console.log(this.getView());
                console.log(this.getView().byId("bookdetails_input_publication_date"));

                const publicationDate = this.getView().byId("bookdetails_input_publication_date").getValue();
                const book = {
                    ISBN: this.getView().byId("bookdetails_text_isbn").getValue(),
                    Title: this.getView().byId("bookdetails_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookdetails_input_language").getValue(),
                    Description: this.getView().byId("bookdetails_input_description").getValue()
                }

                console.log(book);

                // const authors = this.getView().byId("bookdetails_authorsMultiComboBox").getSelectedKeys();
                // const genres = this.getView().byId("bookdetails_genresMultiComboBox").getSelectedKeys();

                // await Service.updateBook(this.getOwnerComponent().getModel(), book);

                // await Service.deleteAuthBook(this.getOwnerComponent().getModel(), book.ISBN);
                // await Service.deleteBookGenre(this.getOwnerComponent().getModel(), book.ISBN);
                
                // for(let i = 0; i < authors.length; i++){
                //     await Service.createAuthBook(this.getOwnerComponent().getModel(), book.ISBN, authors[i]);
                // };

                // for(let i = 0; i < genres.length; i++){
                //     await Service.createBookGenre(this.getOwnerComponent().getModel(), book.ISBN, genres[i]);
                // };

                // this.getView().getModel().submitChanges({
                //     success: () => {
                //         sap.m.MessageToast.show("Successfully saved!");
                //         this.onNavBack();
                //     },
                //     error: () => {
                //         sap.m.MessageToast.show("An error occured!");
                //     }
                // })
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    onNavBack();
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
                                    sap.m.MessageToast.show("An error occured!", oError);
                                }
                            })
                        }
                    }
                })
            },

            // onNavBack: function () {
            //     let oHistory = History.getInstance(),
            //         sPreviousHash = oHistory.getPreviousHash();

            //     if (sPreviousHash !== undefined) {
            //         window.history.go(-1);
            //     } else {
            //         let oRouter = this.getOwnerComponent().getRouter();
            //         oRouter.navTo("Main", {}. true);
            //     }
            // }
        });
    });