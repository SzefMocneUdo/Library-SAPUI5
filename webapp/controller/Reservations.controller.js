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

    return Base.extend("zkzilibraryproject.controller.Reservations", {
        onInit: function () {            
        },
        
        setUserName: function () {
            return new Promise((resolve) => {
                Service.getUserInfo(this.getOwnerComponent().getModel()).then((uname) => {
                    this.username = uname.results[0].UserName;                   
                    resolve();
                }).catch((oError) => {
                    console.error(oError);
                    resolve();
                });
            });
        },

        // countItemsPerFilter: function () {
        //     var oModel = this.getOwnerComponent().getModel();
        //     var oData = oModel.oData;
        //     console.log(oData);   

        //     var iCountAll = 0,
        //         iCountFinished = 0,
        //         iCountPickedUp = 0,
        //         iCountDelayed = 0;

        //     // oData.forEach(function (oReservation) {
        //     //     iCountAll++;
        //     //     switch (oReservation.Status) {
        //     //         case "FINISHED":
        //     //             iCountFinished++;
        //     //             break;
        //     //         case "PICKED UP":
        //     //             iCountPickedUp++;
        //     //             break;
        //     //         case "DELAYED":
        //     //             iCountDelayed++;
        //     //             break;
        //     //         default:
        //     //             break;
        //     //     }
        //     // });

        //     this.getView().byId("ReservationsMaintenanceIconTabFilter1").setCount(iCountAll);
        //     this.getView().byId("ReservationsMaintenanceIconTabFilter2").setCount(iCountFinished);
        //     this.getView().byId("ReservationsMaintenanceIconTabFilter3").setCount(iCountPickedUp);
        //     this.getView().byId("ReservationsMaintenanceIconTabFilter4").setCount(iCountDelayed);
        // },

        onBeforeRendering() {
            this.username = ""; 
            this.setUserName().then(() => {
                this.setDataFilter();
            });          
        },

        onFilterSelect: function (oEvent) {
            var oBinding = this.byId("main_table_UserReservations").getBinding("items"),
                sKey = oEvent.getParameter("key"),
                aFilters = [];
        
            if (sKey === "all") {
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
            }
                else if (sKey === "pickedup") {
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
                aFilters.push(new Filter("Status", FilterOperator.EQ, "PICKED UP"));
                
            }
            else if (sKey === "reserved") {
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
                aFilters.push(new Filter("Status", FilterOperator.EQ, "RESERVED"));
                
            }
            else if (sKey === "canceled") {
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
                aFilters.push(new Filter("Status", FilterOperator.EQ, "CANCELED"));
                
            }           
            
            oBinding.filter(new Filter({
                filters: aFilters,
                and: true
            }));

            console.log(this.getOwnerComponent().getModel());
            
        },

        setDataFilter: async function () {
            const oBinding = this.byId("main_table_UserReservations").getBinding("items");                        
            oBinding.filter(new Filter("Reader", FilterOperator.EQ, this.username));            
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

            oModel.oData.IsMaintainable = false;

            this.oDialog.setModel(oModel);

            this.oDialog.open();
        },
        
        onDetailsDialog: function(oEvent) {
            var oReservation = oEvent.getSource().getBindingContext().getObject();        
             
            const startDate = new Date(oReservation.StartDate);
            const endDate = new Date(oReservation.EndDate);

            const formattedStartDate = startDate;
            const formattedEndDate = endDate;
        
            var oDialogModel = new JSONModel({
                Reservationid: oReservation.Reservationid,
                Status: oReservation.Status,
                Books: oReservation.Books,
                Reader: oReservation.Reader,
                FormattedStartDate: formattedStartDate,
                FormattedEndDate: formattedEndDate,
                IsMaintainable: false
            });
        
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
				filter = [new Filter("Status", FilterOperator.Contains, sQuery),
                    new Filter("Reader", FilterOperator.EQ, this.username)];
			}
            else if (sQuery.length === 0) {
                filter = new Filter("Reader", FilterOperator.EQ, this.username);
            }
            this.getView().byId("main_table_UserReservations").getBinding("items").filter(filter);            
        },

        onCancelPressed: async function () {
            const reservation = {
                Reservationid: (this.byId("SimpleFormChangeColumn_ReservationDetails").mAggregations.title).slice(-36),
                Status: "CANCELED"
            }

            let sText = "Are You sure that You want to cancel the reservation?";

            MessageBox.confirm(sText, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: async (sAction) => {
                    if (MessageBox.Action.YES === sAction) {
                        try {

                            await Service.updateReservation(this.getOwnerComponent().getModel(), reservation);
        
                            this.getView().getModel().submitChanges({
                                success: () => {
                                    sap.m.MessageToast.show("Reservation canceled");
                                    this.getOwnerComponent().getModel().refresh(true);
                                    this.closeDialog();
                                },
                                error: () => {
                                    sap.m.MessageToast.show("An error occurred!");
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
                    sap.m.MessageToast.show("You must select at least one book");
                }
                else{
                    let oModel = this.getOwnerComponent().getModel();
                    const createdreservation = await Service.createReservation(oModel, reservation);

                    for(let i = 0; i < books.length; i++){
                        await Service.createBookReservation(oModel, books[i], createdreservation.Reservationid);
                    };
            
                    this.getView().getModel().submitChanges({
                        success: () => {
                            MessageBox.information(`A new reservation with ID: '${createdreservation.Reservationid}' has been created`);
                            this.getOwnerComponent().getModel().refresh(true);
                            this.closeDialog();
                        },
                        error: () => {
                            sap.m.MessageToast.show("An error occurred!");
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
