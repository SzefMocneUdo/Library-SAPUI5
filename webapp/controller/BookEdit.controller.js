sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/ui/core/format/DateFormat",
    "zkzilibraryproject/model/service",
    "sap/m/MessageToast"
],

    function (Base, DateFormat, Service, MessageToast){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

                let oModel = this.getOwnerComponent().getModel();

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
                        console.error(oError);
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
                        console.error(oError);
                    }
                });

                oBinding = oGenreControl.getBinding("items");
                oBinding.attachDataReceived(function(){
                    oGenreControl.setSelectedKeys(gSelectedKeys);
                })

            },

            onSavePressed: async function() {
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle();

                const publicationDate = this.getView().byId("bookedit_input_publication_date").getValue();
                const ISBN = this.getView().byId("bookedit_text_isbn").getValue();
                const book = {
                    ISBN: ISBN,
                    Title: this.getView().byId("bookedit_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookedit_languageComboBox").getSelectedKey(),
                    Description: this.getView().byId("bookedit_input_description").getValue()
                };

                let oModel = this.getOwnerComponent().getModel();

                const authors = [];
                const genres = [];
                let sPathAuthorBook = "/BookSet('" + ISBN + "')/ToAuthorBookSet";
                let sPathBookGenre = "/BookSet('" + ISBN + "')/ToBookGenreSet";
            
                const newauthors = this.getView().byId("bookedit_authorsMultiComboBox").getSelectedKeys();
                const newgenres = this.getView().byId("bookedit_genresMultiComboBox").getSelectedKeys();
            
                try {
                    if (book.ISBN === "") {
                        MessageToast.show(oResourceBundle.getText("ISBNEmpty"));
                        return;
                    }
                    if (book.Title === "") {
                        MessageToast.show(oResourceBundle.getText("TitleEmpty"));
                        return;
                    }
                    if (newauthors.length === 0) {
                        MessageToast.show(oResourceBundle.getText("AuthorsEmpty"));
                        return;
                    }
                    if (newgenres.length === 0) {
                        MessageToast.show(oResourceBundle.getText("GenresEmpty"));
                        return;
                    }
                    if (book.PublicationDate === "") {
                        MessageToast.show(oResourceBundle.getText("PublicationDateEmpty"));
                        return;
                    }
                    if (book.Language === "") {
                        MessageToast.show(oResourceBundle.getText("LanguageEmpty"));
                        return;
                    }
                    if (book.Description === "") {
                        MessageToast.show(oResourceBundle.getText("DescriptionEmpty"));
                        return;
                    }

                    await new Promise((resolve, reject) => {
                        oModel.read(sPathAuthorBook, {
                            success: function (oData) {
                                oData.results.forEach(element => {
                                    authors.push(element.Authorid);
                                });
                                resolve();
                            },
                            error: function (oError) {
                                reject(oError);
                            }
                        });
                    });

                    for (let i = 0; i < authors.length; i++) {
                        await Service.deleteAuthBook(oModel, ISBN, authors[i]);
                    }

                    await new Promise((resolve, reject) => {
                        oModel.read(sPathBookGenre, {
                            success: function (oData) {
                                oData.results.forEach(element => {
                                    genres.push(element.Genreid);
                                });
                                resolve();
                            },
                            error: function (oError) {
                                reject(oError);
                            }
                        });
                    });

                    for (let i = 0; i < genres.length; i++) {
                        await Service.deleteBookGenre(oModel, ISBN, genres[i]);
                    }
            
                    for (let i = 0; i < newauthors.length; i++) {
                        await Service.createAuthBook(oModel, book.ISBN, newauthors[i]);
                    }
            
                    for (let i = 0; i < newgenres.length; i++) {
                        await Service.createBookGenre(oModel, book.ISBN, newgenres[i]);
                    
                    }

                    await Service.updateBook(this.getOwnerComponent().getModel(), book);
                    await this.getView().getModel().submitChanges({
                        success: () => {
                            MessageToast.show(oResourceBundle.getText("BookUpdated"));
                            this.getOwnerComponent().getModel().refresh(true);
                            this.onNavBack();
                        },
                        error: () => {
                            MessageToast.show(oResourceBundle.getText("ErrorOccured"));
                        }
                    });
            
                } catch (oError) {
                    MessageToast.show(this.getErrorMessage(oError));
                }
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            }
        });
    });