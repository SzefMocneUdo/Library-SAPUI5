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
                console.log(oModel.getObject());
                

                //this.getView().byId("bookedit_authorsMultiComboBox").setSelectedKeys();

                // oModel.read("/BookSet('1111111111111')/ToAuthorBookSet", {
                //     success: function (oData) {
                //         let aSelectedAuthorsIds = oData.ToAuthorBookSet.results.map(function (author) {
                //             console.log(aSelectedAuthorsIds)
                //             return author.Authorid;
                //         });

                //         this.getView().byId("bookedit_authorsMultiComboBox").setSelectedKeys(aSelectedAuthorsIds);

                //         let oLocalModel = new sap.ui.model.json.JSONModel({
                //             selectedAuthors: aSelectedAuthorsIds,
                //             AllAuthors: []
                //         });
                //         this.getView().setModel(oLocalModel);

                //         oModel.read("/AuthorSet", {
                //             success: function (oAuthorsData) {
                //                 oLocalModel.setProperty("/AllAuthors", oAuthorsData.results);
                //             },
                //             error: function() {
                //                 sap.m.MessageToast.show("Nie udało się pobrać listy autorów");
                //             }
                //         });
                //     }.bind(this),
                //     error: function () {
                //         sap.m.MessageToast.show("Nie udało się pobrać danych książki");
                //     }
                // });

                //this.getView().byId("bookedit_authorsMultiComboBox").setItems(this.getSelectedKeys())

                // const authors = this.getView().byId("bookdetails_authorsMultiComboBox").getSelectedKeys();
                
                // let oDataModelAuthors = new sap.ui.model.odata.v2.ODataModel("/AuthorSet");

                // let oItemTemplate = new sap.ui.core.Item({
                //     key: "{Authorid}",
                //     text: "{Name}"
                // });

                

                // let mcb = new sap.m.MultiComboBox({
                //     id: "mcb",
                //     items: {
                //         path: "/AuthorSet",
                //         template: oItemTemplate
                //     },
                //     selectedKeys: authors
                // });

                // mcb.setModel(oDataModelAuthors);
                // mcb.placeAt('BookEdit')
            },

            onBeforeRendering: function() {
                let isbn = this.getView().byId("bookedit_text_isbn")
                console.log(isbn);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath,{ expand: "ToBookGenreSet,ToAuthorBookSet" });
                //console.log(oEvent.getSource().getBindingContext().getObject().ISBN)
            },

            onSavePressed: async function(){
                const publicationDate = this.getView().byId("bookedit_input_publication_date").getValue();
                const isbn = this.getView().byId("bookedit_text_isbn").getText();
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
                console.log(newauthors);
                console.log(newgenres);

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