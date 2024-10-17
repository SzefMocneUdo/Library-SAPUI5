sap.ui.define([
    "sap/ui/core/Fragment",
    "zkzilibraryproject/model/service",
    "zkzilibraryproject/controller/Base.controller"
],
function (Fragment, Service, Base) {
    "use strict";

    return Base.extend("zkzilibraryproject.controller.GenresMaintenance", {
        onInit: function () {
        },        

        onNavToDetail: function(oEvent){
            let oRouter = this.getOwnerComponent().getRouter();
            const sPath = oEvent.getSource().getBindingContext().getPath();

            oRouter.navTo("GenreDetails", {
                path: encodeURIComponent(sPath)
            });
        },

        onCreatePressed: async function () {
            let i18nModel = this.getView().getModel("i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

            this.oDialog ??= await Fragment.load({
                id: this.getView().getId(),
                name: "zkzilibraryproject.fragment.CreateGenreDialog",
                controller: this
            });

            this.oDialog.open();
        },

        onCancelPressed: function () {
            this.oDialog.close();
        },

        onSavePressed: async function () {
            let Name = this.byId("CreateGenreNameDialogInput").getValue();
            let Description = this.byId("CreateGenreDescriptionDialogInput").getValue();

            try{
                if (Name === "") {
                    sap.m.MessageToast.show("Name cannot be empty");
                }
                else if (Description === "") {
                    sap.m.MessageToast.show("Description cannot be empty");
                }
                else {
                    await Service.createGenre(this.getOwnerComponent().getModel(), Name, Description);

                    this.getView().getModel().submitChanges({
                        success: () => {
                            sap.m.MessageToast.show("Successfully saved!");
                            
                            this.getOwnerComponent().getModel().refresh(true);
        
                            // this.onNavBack();
                            this.oDialog.close();
                        },
                        error: () => {
                            sap.m.MessageToast.show("An error occured!");
                        }
                    })
                } 
            } catch (oError){
                sap.m.MessageToast.show(this.getErrorMessage(oError));
            }            
        }        
    });
});
