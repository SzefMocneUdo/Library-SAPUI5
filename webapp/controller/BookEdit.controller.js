sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, DateFormat, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

                let oModel = this.getOwnerComponent().getModel();
                console.log(oModel.oData);

                this.getView().addEventDelegate({
                    onBeforeShow: this.onBeforeShow
                }, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);

                //Setting author keys in authors MultiComboBox

                let oAuthControl = this.byId("bookedit_authorsMultiComboBox");
                let oModel = this.getView().getModel();
                let aSelectedKeys = [];

                oModel.read(sPath + "/ToAuthorBookSet", {
                    success: function(oData) {
                        aSelectedKeys = oData.results.map(author => author.Authorid);
                        oAuthControl.setSelectedKeys(aSelectedKeys);
                    },
                    error: function(oError) {
                        console.error("Błąd podczas pobierania autorów", oError);
                    }
                });

                var oBinding = oAuthControl.getBinding("items");
                oBinding.attachDataReceived(function(){
                    oAuthControl.setSelectedKeys(aSelectedKeys);
                })

                //Setting genre keys in genres MultiComboBox

                let oGenreControl = this.byId("bookedit_genresMultiComboBox");
                let gSelectedKeys = [];

                oModel.read(sPath + "/ToBookGenreSet", {
                    success: function(oData) {
                        gSelectedKeys = oData.results.map(genre => genre.Genreid);
                        oGenreControl.setSelectedKeys(gSelectedKeys);
                    },
                    error: function(oError) {
                        console.error("Błąd podczas pobierania autorów", oError);
                    }
                });

                oBinding = oGenreControl.getBinding("items");
                oBinding.attachDataReceived(function(){
                    oGenreControl.setSelectedKeys(gSelectedKeys);
                })

            },

            onSavePressed: async function(){
                const publicationDate = this.getView().byId("bookedit_input_publication_date").getValue();
                const isbn = this.getView().byId("bookedit_text_isbn").getValue();
                const book = {
                    ISBN: isbn,
                    Title: this.getView().byId("bookedit_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookedit_languageComboBox").getSelectedKey(),
                    Description: this.getView().byId("bookedit_input_description").getValue()
                }


                const newauthors = this.getView().byId("bookedit_authorsMultiComboBox").getSelectedKeys();
                const newgenres = this.getView().byId("bookedit_genresMultiComboBox").getSelectedKeys();

                console.log(book);

                // await Service.updateBook(this.getOwnerComponent().getModel(), book);

                // await Service.deleteAllAuthorsByISBN(this.getOwnerComponent().getModel(), book.ISBN);
                // await Service.deleteAllGenresByISBN(this.getOwnerComponent().getModel(), book.ISBN);
                
                // for(let i = 0; i < newauthors.length; i++){
                //     await Service.createAuthBook(this.getOwnerComponent().getModel(), book.ISBN, newauthors[i]);
                // };

                // for(let i = 0; i < newgenres.length; i++){
                //     await Service.createBookGenre(this.getOwnerComponent().getModel(), book.ISBN, newgenres[i]);
                // };

                // this.getView().getModel().submitChanges({
                //     success: () => {
                //         sap.m.MessageToast.show("Successfully saved!");
                        
                //         this.getOwnerComponent().getModel().refresh(true);

                //         this.getOwnerComponent().getRouter().navTo("Books");
                //     },
                //     error: () => {
                //         sap.m.MessageToast.show("An error occured!");
                //     }
                // })
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