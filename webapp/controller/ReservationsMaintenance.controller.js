sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    "zkzilibraryproject/model/Service",
    "sap/ui/core/format/DateFormat"
],
function (Base, MessageBox, JSONModel, Filter, FilterOperator, Fragment, Service, DateFormat) {
    "use strict";

    return Base.extend("zkzilibraryproject.controller.ReservationsMaintenance", {
        onInit: function () {
        },

        onFilterSelect: function (oEvent) {
            var oBinding = this.byId("main_table_reservationsmaintenance").getBinding("items"),
                sKey = oEvent.getParameter("key"),
                aFilters = [];
        
            if (sKey === "pickedup") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "PICKED UP"));
            }
            else if (sKey === "reserved") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "RESERVED"));
            }
            else if (sKey === "canceled") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "CANCELED"));
            }
            
            oBinding.filter(aFilters);
        },

        onCreateReservation: async function() {
            let i18nModel = this.getView().getModel("i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

            let oModel = this.getOwnerComponent().getModel();
            oModel.read("/Book_copySet");

            this.oDialog ??= await Fragment.load({
                id: this.getView().getId(),
                name: "zkzilibraryproject.fragment.CreateReservationDialog",
                controller: this
            });

            oModel.oData.IsMaintainable = true;

            this.oDialog.setModel(oModel);

            this.oDialog.open();

            const todayDate = new Date();

            this.byId("CreateReservation_input_start_date").setMinDate(todayDate);
            this.byId("CreateReservation_input_end_date").setMinDate(todayDate);
        },
        
        onDetailsDialog: function(oEvent) {
            var oReservation = oEvent.getSource().getBindingContext().getObject();        
             
            const startDate = new Date(oReservation.StartDate);
            const endDate = new Date(oReservation.EndDate);

            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedStartDate = startDate;
            const formattedEndDate = endDate;
        
            var oDialogModel = new JSONModel({
                Reservationid: oReservation.Reservationid,
                Status: oReservation.Status,
                Books: oReservation.Books,
                Reader: oReservation.Reader,
                FormattedStartDate: formattedStartDate,
                FormattedEndDate: formattedEndDate,
                IsMaintainable: true
            });

            if(oDialogModel.oData.Status === "RESERVED") {
                oDialogModel.oData.IsMaintainable = true;
            } else {
                oDialogModel.oData.IsMaintainable = false;
            }
        
            if (!this.oDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "zkzilibraryproject.fragment.ReservationDetailsDialog",
                    controller: this
                }).then(function(oDialog) {
                    this.oDialog = oDialog;
                    this.getView().addDependent(this.oDialog);
                    this.oDialog.setModel(oDialogModel);
                    this.oDialog.open();
                }.bind(this));
            } else {
                this.oDialog.setModel(oDialogModel);
                this.oDialog.open();
            }
        },

        onSearch: function (oEvent) {
            let filter;
			let sQuery = oEvent.getSource().getValue();

			if (sQuery && sQuery.length > 0) {
                sQuery = sQuery.toUpperCase();
				filter = new Filter("Status", FilterOperator.Contains, sQuery);
			}
            this.getView().byId("main_table_reservationsmaintenance").getBinding("items").filter(filter);
        },

        onUpdatePressed: async function () {
            let i18nModel = this.getView().getModel("i18n"),
                oResourceBundle = i18nModel.getResourceBundle();

            const reservation = {
                Reservationid: (this.byId("SimpleFormChangeColumn_ReservationDetails").mAggregations.title).slice(-36),
                Status: this.byId("ReservationStatusComboBox").getSelectedKey()
            }

                try {
                    await Service.updateReservation(this.getOwnerComponent().getModel(), reservation);

                    this.getView().getModel().submitChanges({
                        success: () => {
                            sap.m.MessageToast.show(oResourceBundle.getText("SuccessfullyUpdated"));
                            this.getOwnerComponent().getModel().refresh(true);
                            this.closeDialog();
                        },
                        error: () => {
                            sap.m.MessageToast.show(oResourceBundle.getText("ErrorOccured"));
                        }
                    });
                } catch (oError) {
                    sap.m.MessageToast.show(this.getErrorMessage(oError));
                }
        },

        onCancelPressed: async function () {
            let i18nModel = this.getView().getModel("i18n"),
                oResourceBundle = i18nModel.getResourceBundle();
            const reservation = {
                Reservationid: (this.byId("SimpleFormChangeColumn_ReservationDetails").mAggregations.title).slice(-36),
                Status: "CANCELED"
            }

            MessageBox.confirm(oResourceBundle.getText("deleteQuestion"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: async (sAction) => {
                    if (MessageBox.Action.YES === sAction) {
                        try {

                            await Service.updateReservation(this.getOwnerComponent().getModel(), reservation);
        
                            this.getView().getModel().submitChanges({
                                success: () => {
                                    sap.m.MessageToast.show(oResourceBundle.getText("ReservationCanceled"));
                                    this.getOwnerComponent().getModel().refresh(true);
                                    this.closeDialog();
                                },
                                error: () => {
                                    sap.m.MessageToast.show(oResourceBundle.getText("ErrorOccured"));
                                }
                            });
                        } catch (oError) {
                            sap.m.MessageToast.show(this.getErrorMessage(oError));
                        }
                    }
                }
            })

                
        },

        onSavePressed: async function () {
            let i18nModel = this.getView().getModel("i18n"),
                oResourceBundle = i18nModel.getResourceBundle();

            let startDate = this.byId("CreateReservation_input_start_date").getValue(),
                endDate = this.byId("CreateReservation_input_end_date").getValue();

            const reservation = {
                Reader: this.byId("CreateReservationCustomerInput").getValue(),
                StartDate: startDate === "" ? null : `${DateFormat.getDateInstance({
                            pattern: "yyyy-MM-dd"
                           }).format(new Date(startDate))}T00:00:00`,
                EndDate: endDate === "" ? null : `${DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                   }).format(new Date(endDate))}T00:00:00`
            }

            const books = this.getView().byId("createReservation_booksMultiComboBox").getSelectedKeys();

            try{
                if (books.length === 0) {
                    sap.m.MessageToast.show(oResourceBundle.getText("MustSelectOneBook"));
                }
                else if (reservation.Reader === "") {
                    sap.m.MessageToast.show(oResourceBundle.getText("CustomerEmpty"));
                }
                else{
                    let oModel = this.getOwnerComponent().getModel();
                    const createdreservation = await Service.createReservation(oModel, reservation);

                    for(let i = 0; i < books.length; i++){
                        await Service.createBookReservation(oModel, books[i], createdreservation.Reservationid);
                    };
            
                    this.getView().getModel().submitChanges({
                        success: () => {
                            MessageBox.information(oResourceBundle.getText("NewReservationWithId") + createdreservation.Reservationid + ' ' + oResourceBundle.getText("HasBeenCrated"));
                            this.getOwnerComponent().getModel().refresh(true);
                            this.closeDialog();
                        },
                        error: () => {
                            sap.m.MessageToast.show(oResourceBundle.getText("ErrorOccured"));
                        }
                    });
                }
            } catch (oError) {
                sap.m.MessageToast.show(this.getErrorMessage(oError));                
            }
        },

        closeDialog: function () {
            this.oDialog.close();
            this.oDialog.destroy();
            this.oDialog = null;

            this.getView().getModel().refresh(true);
        },
        
        stateStatusFormatter: function(Status){
            if(Status ===  "PICKED UP"){
                return "Success";
            }
            else if(Status === "RESERVED"){
                return "Warning";
            }
            else{
                return "Error";
            }
        },

        iconStatusFormatter: function(Status){
            if(Status ===  "PICKED UP"){
                return "sap-icon://message-success";
            }
            else if(Status === "RESERVED"){
                return "sap-icon://message-warning";
            }
            else{
                return "sap-icon://message-error";
            }
        }
    });
});
