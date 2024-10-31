sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    "zkzilibraryproject/model/Service",
    "sap/ui/core/format/DateFormat"
],
function (Base, JSONModel, Filter, FilterOperator, Fragment, Service, DateFormat) {
    "use strict";

    return Base.extend("zkzilibraryproject.controller.Loans", {
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

        //     this.getView().byId("UserLoansIconTabFilter1").setCount(iCountAll);
        //     this.getView().byId("UserLoansIconTabFilter2").setCount(iCountFinished);
        //     this.getView().byId("UserLoansIconTabFilter3").setCount(iCountPickedUp);
        //     this.getView().byId("UserLoansIconTabFilter4").setCount(iCountDelayed);
        // },

        onBeforeRendering() {
            this.username = ""; 
            this.setUserName().then(() => {
                this.setDataFilter();
            });          
        },

        onFilterSelect: function (oEvent) {
            var oBinding = this.byId("main_table_UserLoans").getBinding("items"),
                sKey = oEvent.getParameter("key"),
                aFilters = [];                
        
            if (sKey === "all") {
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
            }
            else if (sKey === "finished") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "FINISHED"));
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
            }
            else if (sKey === "pickedup") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "PICKED UP"));
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
            }
            else if (sKey === "delayed") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, "DELAYED"));
                aFilters.push(new Filter("Reader", FilterOperator.EQ, this.username));
            }
            
            oBinding.filter(new Filter({
                filters: aFilters,
                and: true
            }));

            console.log(this.getOwnerComponent().getModel());
        },

        setDataFilter: async function () {
            const oBinding = this.byId("main_table_UserLoans").getBinding("items");                        
            oBinding.filter(new Filter("Reader", FilterOperator.EQ, this.username));
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
                IsMaintainable: false
            });
        
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
				filter = [new Filter("Status", FilterOperator.Contains, sQuery),
                    new Filter("Reader", FilterOperator.EQ, this.username)];
			}
            else if (sQuery.length === 0) {
                filter = new Filter("Reader", FilterOperator.EQ, this.username);
            }
            this.getView().byId("main_table_UserLoans").getBinding("items").filter(filter);
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
