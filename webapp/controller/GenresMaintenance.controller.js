sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button"
],
function (Controller, Dialog, mobileLibrary, List, StandardListItem, Button) {
    "use strict";

    // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

    return Controller.extend("zkzilibraryproject.controller.GenresMaintenance", {
        onInit: function () {
        },        

        onDetailsDialog: function(oEvent) {
            var oGenre = oEvent.getSource().getBindingContext().getObject();
            
            if (!this.oFixedSizeDialog) {
                this.oFixedSizeDialog = new Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("GenreDetails"),
                    contentWidth: "550px",
                    contentHeight: "300px",
                    content: [
                        new StandardListItem({
                            title: "Genre ID",
                            description: "{/Genreid}"
                        }),
                        new StandardListItem({
                            title: "Name",
                            description: "{/Name}"
                        }),
                        new StandardListItem({
                            title: "Description",
                            description: "{/Description}"
                        })
                    ],
                    subHeader : new sap.m.Bar({
                        contentRight : [new sap.m.Button({text : "Save", type:"Transparent", press:"onSave"}),
                            new sap.m.Button({text : "Edit", type:"Transparent", press:"onEdit"}),
                            new sap.m.Button({text : "Cancel", type:"Transparent", press:"onCancel"})
                        ],
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Close",
                        press: function () {
                            this.oFixedSizeDialog.close();
                        }.bind(this)
                    })
                });
                
                this.getView().addDependent(this.oFixedSizeDialog);
            }
        
        
            var oDialogModel = new sap.ui.model.json.JSONModel({
                Genreid: oGenre.Genreid,
                Name: oGenre.Name,
                Description: oGenre.Description
            });
        
            this.oFixedSizeDialog.setModel(oDialogModel);
            
            this.oFixedSizeDialog.open();
        },
        
    });
});
