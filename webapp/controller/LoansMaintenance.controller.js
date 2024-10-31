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

    return Base.extend("zkzilibraryproject.controller.LoansMaintenance", {
        onInit: function () {       
            // this.countItemsPerFilter();   
        },

        // countItemsPerFilter: function () {
        //     var oModel = this.getOwnerComponent().getModel();
        //     var oData = oModel.oData;
        //     console.log(oData);   

        //     var iCountAll = 0,
        //         iCountFinished = 0,
        //         iCountPickedUp = 0,
        //         iCountDelayed = 0;

        //     // oData.forEach(function (oLoan) {
        //     //     iCountAll++;
        //     //     switch (oLoan.Status) {
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

        //     this.getView().byId("LoansMaintenanceIconTabFilter1").setCount(iCountAll);
        //     this.getView().byId("LoansMaintenanceIconTabFilter2").setCount(iCountFinished);
        //     this.getView().byId("LoansMaintenanceIconTabFilter3").setCount(iCountPickedUp);
        //     this.getView().byId("LoansMaintenanceIconTabFilter4").setCount(iCountDelayed);
        // },

        onFilterSelect: function (oEvent) {
            var oBinding = this.byId("main_table_loansmaintenance").getBinding("items"),
                sKey = oEvent.getParameter("key"),
                aFilters = [];
        
            if (sKey === "finished") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "FINISHED"));
            }
            else if (sKey === "pickedup") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "PICKED UP"));
            }
            else if (sKey === "delayed") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "DELAYED"));
            }
            
            oBinding.filter(aFilters);
        },

        onCreateLoan: async function() {
            let i18nModel = this.getView().getModel("i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

            let oModel = this.getOwnerComponent().getModel();
            oModel.read("/Book_copySet");

            this.oDialog ??= await Fragment.load({
                id: this.getView().getId(),
                name: "zkzilibraryproject.fragment.CreateLoanDialog",
                controller: this
            });

            this.oDialog.setModel(oModel);

            this.oDialog.open();
        },
        
        onDetailsDialog: function(oEvent) {
            var oLoan = oEvent.getSource().getBindingContext().getObject();          
             
            const startDate = new Date(oLoan.StartDate);
            const endDate = new Date(oLoan.EndDate);
            const pickupDate = new Date(oLoan.PickupDate);
            const returnDate = new Date(oLoan.ReturnDate);

            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedStartDate = startDate;
            const formattedEndDate = endDate;
            const formattedPickupDate = pickupDate;
            const formattedReturnDate = returnDate.toLocaleDateString(navigator.language, options);
        
            var oDialogModel = new JSONModel({
                Loanid: oLoan.Loanid,
                Status: oLoan.Status,
                Books: oLoan.Books,
                Reader: oLoan.Reader,
                FormattedStartDate: formattedStartDate,
                FormattedEndDate: formattedEndDate,
                FormattedPickupDate: formattedPickupDate,
                FormattedReturnDate: formattedReturnDate,
                IsMaintainable: true
            });

            if(oDialogModel.oData.Status !== "FINISHED") {
                oDialogModel.oData.IsMaintainable = true;
            } else {
                oDialogModel.oData.IsMaintainable = false;
            }
        
            if (!this.oDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "zkzilibraryproject.fragment.LoanDetailsDialog",
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
            this.getView().byId("main_table_loansmaintenance").getBinding("items").filter(filter);
        },

        onUpdatePressed: async function () {
            let returnDate = this.byId("loandetails_input_return_date").getValue();

            const loan = {
                Loanid: (this.byId("SimpleFormChangeColumn_LoanDetails").mAggregations.title).slice(-36),
                Status: this.byId("loanStatusComboBox").getSelectedKey(),
                ReturnDate: returnDate === "" ? null : `${DateFormat.getDateInstance({
                                pattern: "yyyy-MM-dd"
                                }).format(new Date(returnDate))}T00:00:00`
            }

            if(loan.ReturnDate === null && loan.Status == "FINISHED"){
                sap.m.MessageToast.show("Return date cannot be empty!");
            } else {
                try {
                    await Service.updateLoan(this.getOwnerComponent().getModel(), loan);

                    this.getView().getModel().submitChanges({
                        success: () => {
                            sap.m.MessageToast.show("Succesfully updated");
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
        },

        onSavePressed: async function () {

            let startDate = this.byId("CreateLoan_input_start_date").getValue(),
                endDate = this.byId("CreateLoan_input_end_date").getValue();

            const loan = {
                Reader: this.byId("CreateLoanCustomerInput").getValue(),
                StartDate: startDate === "" ? null : `${DateFormat.getDateInstance({
                            pattern: "yyyy-MM-dd"
                           }).format(new Date(startDate))}T00:00:00`,
                EndDate: endDate === "" ? null : `${DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                   }).format(new Date(endDate))}T00:00:00`
            }

            const books = this.getView().byId("createloan_booksMultiComboBox").getSelectedKeys();

            try{
                if (books.length === 0) {
                    sap.m.MessageToast.show("You must select at least one book");
                }
                else if (loan.Reader === "") {
                    sap.m.MessageToast.show("Customer cannot be empty");
                }
                else{
                    let oModel = this.getOwnerComponent().getModel();
                    const createdloan = await Service.createLoan(oModel, loan);

                    for(let i = 0; i < books.length; i++){
                        await Service.createBookLoan(oModel, books[i], createdloan.Loanid);
                    };
            
                    this.getView().getModel().submitChanges({
                        success: () => {
                            MessageBox.information(`A new loan with ID: '${createdloan.Loanid}' has been created`);
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
            if(Status ===  "FINISHED"){
                return "Success";
            }
            else if(Status === "PICKED UP"){
                return "Warning";
            }
            else{
                return "Error";
            }
        },

        iconStatusFormatter: function(Status){
            if(Status ===  "FINISHED"){
                return "sap-icon://message-success";
            }
            else if(Status === "PICKED UP"){
                return "sap-icon://message-warning";
            }
            else{
                return "sap-icon://message-error";
            }
        }
    });
});