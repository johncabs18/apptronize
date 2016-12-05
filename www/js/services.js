angular.module('apptronize.services',['firebase'])

.factory('members', ['$firebaseArray', '$firebaseObject', function($firebaseArray, $firebaseObject)
{
    var ref = new Firebase(firebaseurl);          
    return {
        savenewmember: function(data, uuid){
            var profile = new Firebase(firebaseurl + '/members/' + uuid);
            profile.set(data);
            return true;
        },

        getmemberdata: function(uuid){
            var dataobj = $firebaseObject(ref.child('members').child(uuid));
            return dataobj;
        },

        addnonmember: function(userid, uuid){
            var nonmember = new Firebase(firebaseurl + '/nonmembers/' + uuid);
            var savenonmember = $firebaseArray(nonmember);
            return savenonmember.$add({ userid: userid });            
        },

        getallmembers: function(userid, uuid){
            var dataobj = $firebaseObject(ref.child('members'));   
            return dataobj;         
        }
    }
}])
.factory('transactions', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q)
{
    var ref = new Firebase(firebaseurl);          
    /*return {
        savetransaction: function(buyerid, sellerid, data){
            var transid = new Date().getTime();     
            var boughttransact = $firebaseArray(ref.child('members').child(buyerid).child('boughttransaction'));
            var soldtransact = $firebaseArray(ref.child('members').child(sellerid).child('soldtransaction'));
            boughttransact.$add({ transid: transid, sellerid: sellerid}).then(function(){
                soldtransact.$add({ transid: transid, buyerrid: buyerid }).then(function(){
                     var savetransdata = new Firebase(firebaseurl + '/transactions/' + transid);
                     if(!data.transactionphoto){
                        data.transactionphoto = "";
                     }
                    savetransdata.set({'description': data.transdescription, 'photo': data.transactionphoto, 'status': 'pending'});
                    return true;
                });
            });
        },

        getactivities: function(uuid){
            var activities = $firebaseArray(ref.child('members').child(uuid).child('boughttransaction'));
            return activities;             
        },

        gettransaction: function(transid){
            var transinfo = $firebaseArray(ref.child('transactions').child(transid));
            return transinfo;   
        },

        listtransactions: function(accountid){
           var deferred = $q.defer();                          
            ref.child('members/' + accountid + '/boughttransaction').once('value', function(snapshot) {
                snapshot.forEach(function(transdata) {                  
                    ref.child('transactions/' + transdata.val().transid).once('value', function(snapshot2) {                       
                       //lists.push(snapshot2.val()); 
                       deferred.resolve(snapshot2.val());                       
                    });
                    //console.log('a ' + JSON.stringify(lists));
                });               
            });

            return deferred.promise;           
        }
    }*/

    var transactions = {};
    
    var transactionsAction =  {
       
        all: function () {
            return transactions;
        },

        savetransaction: function(buyerid, sellerid, data){
            var transid = new Date().getTime();     
            /*var boughttransact = $firebaseArray(ref.child('members').child(buyerid).child('boughttransaction'));
            var soldtransact = $firebaseArray(ref.child('members').child(sellerid).child('soldtransaction'));
            boughttransact.$add({ transid: transid, sellerid: sellerid}).then(function(){
                soldtransact.$add({ transid: transid, buyerrid: buyerid }).then(function(){
                     var savetransdata = new Firebase(firebaseurl + '/transactions/' + transid);
                     if(!data.transactionphoto){
                        data.transactionphoto = "";
                     }
                    savetransdata.set({'description': data.transdescription, 'photo': data.transactionphoto, 'status': 'pending'});
                    return true;
                });
            });*/
            var boughttransact = new Firebase(firebaseurl + '/members/' + buyerid + '/transactions/bought/pending/' + transid);
            var soldtransact = new Firebase(firebaseurl + '/members/' + sellerid + '/transactions/sold/' + transid);
            var savetransdata = new Firebase(firebaseurl + '/transactions/' + transid);
             if(!data.transactionphoto){
                data.transactionphoto = "";
             }
            boughttransact.set({'sellerid': sellerid});
            soldtransact.set({'buyerid': buyerid});
            savetransdata.set({'description': data.transdescription, 'photo': data.transactionphoto});
            return true;
        },
        
        getTransactions: function (userid) {
            var deferred = $q.defer();
            var transRef = ref.child('members/' + userid + '/boughttransaction');
            var memberRef = ref.child('members/' + userid);
            transactions = $firebaseArray(transRef);           
            transactions.$loaded().then(function() {
                angular.forEach(transactions, function(value, key) {                      
                    transactionsAction.getTransaction(transactions[key].transid).then(function (transdata) {
                        transactions[key].description = transdata.description;
                        transactions[key].photo = transdata.photo;
                        transactions[key].status = transdata.status; 
                        memberRef.once("value", function (memberdata) {
                            transactions[key].memberphoto = memberdata.val().photo;
                            transactions[key].membername = memberdata.val().fullname;
                            deferred.resolve(transactions);
                        });                                          
                    });
                });
            });
            return deferred.promise;
        },
       
        getTransaction: function (transid) {
            var deferred = $q.defer();
            var usersRef = ref.child('transactions').child(transid);
            usersRef.once("value", function (snap) {
                var transdata = snap.val();
                deferred.resolve(transdata);
            });
            return deferred.promise;
        },

        getTransactions2: function (userid) {
            var deferred = $q.defer();
            var transRef = ref.child('members/' + userid + '/boughttransaction');
            var memberRef = ref.child('members/' + userid);                        
            var dataArray = [];
            transactions = $firebaseArray(transRef);           
            transactions.$loaded().then(function() {                
                console.log('b ' + JSON.stringify(transactions));
                console.log('c ' + transactions.length);
                if(transactions.length > 0){
                    angular.forEach(transactions, function(value, key) {
                        console.log('b ' + JSON.stringify(dataArray));                      
                        transactionsAction.getTransaction(transactions[key].transid).then(function (transdata) {
                            if(transdata.status === 'approved'){                                                      
                                memberRef.once("value", function (memberdata) {
                                    dataArray.push({
                                                'sellerid': value.sellerid, 
                                                'transid': value.transid,
                                                'description': transdata.description,
                                                'photo': transdata.photo,
                                                'memberphoto': memberdata.val().photo,
                                                'membername': memberdata.val().fullname
                                            }); 
                                    deferred.resolve(dataArray);
                                });                                                         
                            }
                            console.log('a ' + JSON.stringify(dataArray));                                         
                        });
                    });
                }else{
                    dataArray.length = 0;
                }
            });            
            return deferred.promise;
        },
      
        addExpense: function (expense, houseId) {
            var deferred = $q.defer();
            var output = {};
            
            var sync = $firebase(fb.child("houses/"+houseId+'/expenses'));
            sync.$push(expense).then(function(data) {
                console.log();
                deferred.resolve(data);
            }, function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        }     
    };

    return transactionsAction;
}]);

