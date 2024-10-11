sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/StandardListItem",
    "sap/m/Button"
],
function (Controller, Dialog, mobileLibrary, StandardListItem, Button) {
    "use strict";

	var ButtonType = mobileLibrary.ButtonType;


    return Controller.extend("zkzilibraryproject.controller.Reservations", {
        onInit: function () {
        },        

        onDetailsDialog: function(oEvent) {
            var oReservation = oEvent.getSource().getBindingContext().getObject();
            
            if (!this.oFixedSizeDialog) {
                this.oFixedSizeDialog = new Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("ReservationDetails"),
                    contentWidth: "550px",
                    contentHeight: "300px",
                    content: [
                        new StandardListItem({
                            title: "Reservation ID",
                            description: "{/Reservationid}"
                        }),
                        new StandardListItem({
                            title: "Status",
                            description: "{/Status}"
                        }),
                        new StandardListItem({
                            title: "Books",
                            description: "{/Books}"
                        }),
                        new StandardListItem({
                            title: "Start Date",
                            description: "{/FormattedStartDate}" 
                        }),
                        new StandardListItem({
                            title: "End Date",
                            description: "{/FormattedEndDate}"
                        })
                    ],
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
        
            
            const startDate = new Date(oReservation.StartDate);
            const endDate = new Date(oReservation.EndDate);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedStartDate = startDate.toLocaleDateString('pl-PL', options);
            const formattedEndDate = endDate.toLocaleDateString('pl-PL', options);
        
            var oDialogModel = new sap.ui.model.json.JSONModel({
                Reservationid: oReservation.Reservationid,
                Status: oReservation.Status,
                Books: oReservation.Books,
                FormattedStartDate: formattedStartDate,
                FormattedEndDate: formattedEndDate
            });
        
            this.oFixedSizeDialog.setModel(oDialogModel);
            
            this.oFixedSizeDialog.open();
        },
        
    });
});
