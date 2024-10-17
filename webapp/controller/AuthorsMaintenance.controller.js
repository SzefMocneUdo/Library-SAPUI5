sap.ui.define([
    "sap/ui/core/Fragment",
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/Model/Service"
],
function (Fragment, Base, Service) {
    "use strict";

    return Base.extend("zkzilibraryproject.controller.AuthorsMaintenance", {
        onInit: function () {
        },        

        onNavToDetail: function(oEvent){
            let oRouter = this.getOwnerComponent().getRouter();
            const sPath = oEvent.getSource().getBindingContext().getPath();

            oRouter.navTo("AuthorDetails", {
                path: encodeURIComponent(sPath)
            });
        },

        onCreatePressed: async function () {
            let i18nModel = this.getView().getModel("i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

            let oModel = this.getOwnerComponent().getModel();
            oModel.read("/LanguageSet");

            this.oDialog ??= await Fragment.load({
                id: this.getView().getId(),
                name: "zkzilibraryproject.fragment.CreateAuthorDialog",
                controller: this
            });

            this.oDialog.setModel(oModel);

            this.oDialog.open();
        },

        onCancelPressed: function () {
            this.oDialog.close();
        },

        onSavePressed: async function () {
            const Author = {
                Name: this.byId("CreateAuthorNameDialogInput").getValue(),
                Surname: this.byId("CreateAuthorSurnameDialogInput").getValue(),
                Nationality: this.byId("CreateAuthorNationalityDialogInput").getSelectedKey(),
                Description: this.byId("CreateAuthorDescriptionDialogInput").getValue()
            }

                if (Author.Name === "") {
                    sap.m.MessageToast.show("Name cannot be empty");
                }
                else if (Author.Surname === "") {
                    sap.m.MessageToast.show("Surname cannot be empty");
                }
                else if (Author.Nationality === "") {
                    sap.m.MessageToast.show("Nationality cannot be empty");
                }
                else if (Author.Description === "") {
                    sap.m.MessageToast.show("Description cannot be empty");
                }
                else {
                    await Service.createAuthor(this.getOwnerComponent().getModel(), Author).then(() => {
                        this.getView().getModel().submitChanges({
                            success: () => {
                                sap.m.MessageToast.show("Successfully saved!");
            
                                // this.onNavBack();
                                this.oDialog.close();
                            },
                            error: () => {
                                sap.m.MessageToast.show("An error occured!");
                            }
                        })
                    }).catch( () => {
                        this.oDialog.setModel(null);
                        sap.m.MessageToast.show(Base.controller.getErrorMessage(oError));
                    })

                    
                }       
        }        
    });
});
