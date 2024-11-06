sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/model/Service",
    "sap/ui/model/Filter",
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox"
],
function (Base, Service, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Base.extend("zkzilibraryproject.controller.Ratings", {
        onInit() {
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

        onBeforeRendering() {
            this.username = ""; 
            this.setUserName().then(() => {
                this.setDataFilter();
            });          
        },

        setDataFilter: async function () {
            const oBinding = this.byId("main_table_UserRatings").getBinding("items");                        
            oBinding.filter(new Filter("Reader", FilterOperator.EQ, this.username));
        },

        deleteRow: function (oEvent) {
            let i18nModel = this.getView().getModel("i18n"),
                oResourceBundle = i18nModel.getResourceBundle();

            let oButton = oEvent.getSource();            
            let oListItem = oButton.getParent();
            let oModel = this.getView().getModel();
            let oContext = oListItem.getBindingContext();
            let sPath = oContext.getPath();

            MessageBox.confirm(oResourceBundle.getText("deleteQuestion"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: async function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        try{
                            await Service.deleteRating(oModel, sPath);
                        } catch (oError) {
                            console.log(oError);
                        }
                    }
                }
            });
        }

    })
})