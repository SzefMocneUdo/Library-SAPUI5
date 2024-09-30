sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/model/service",
    "sap/ui/core/format/DateFormat"
],

    function (Base, Service, DateFormat){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.CreateBook", {
            onInit: function(){
            },

            onCreatePressed: async function() {
                const publicationDate = this.getView().byId("bookcreate_input_publication_date").getValue();
                const book = {
                    ISBN: this.getView().byId("bookcreate_input_isbn").getValue(),
                    Title: this.getView().byId("bookcreate_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookcreate_input_language").getValue(),
                    Description: this.getView().byId("bookcreate_input_description").getValue()
                }

                const authors = this.getView().byId("bookcreate_authorsMultiComboBox").getSelectedKeys();
                const genres = this.getView().byId("bookcreate_genresMultiComboBox").getSelectedKeys();

                await Service.createBook(this.getOwnerComponent().getModel(), book);
                
                for(let i = 0; i < authors.length; i++){
                    await Service.createAuthBook(this.getOwnerComponent().getModel(), book.ISBN, authors[i]);
                };

                for(let i = 0; i < genres.length; i++){
                    await Service.createBookGenre(this.getOwnerComponent().getModel(), book.ISBN, genres[i]);
                };

                this.getView().getModel().submitChanges({
                    success: () => {
                        sap.m.MessageToast.show("Successfully saved!");
                        this.onNavTo("Main");
                    },
                    error: () => {
                        sap.m.MessageToast.show("An error occured!");
                    }
                })
            },
            
            onCancelCreatePressed: function(){
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                })
            },
        });
    });