'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME

});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post('/loginAdmin/', function(req, res) {
    var aemail = req.body.adminEmail;
    var apw = req.body.adminPassword;

    var sqlsel = "select * from Users where userEmail = ?";

    var inserts = [aemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function(err, data) {
        if (data[0].userPassword != apw) {

        } else if (data[0].userEmail != aemail) {
            console.log("password correct");
        } else {
            console.log("email and password correct");
            res.send({redirect: 'Home.html'});
        }
    });
});

app.post('/insertFaculty/', function(req, res) {
    var fFirstName = req.body.facultyFirstName;
    var fLastName = req.body.facultyLastName;
    var fAddress = req.body.facultyAddress;
    var fPhone = req.body.facultyPhone;
    var fType = req.body.facultyType;
    var fEmail = req.body.facultyEmail;
    var fPassword = req.body.facultyPassword;

    var sqlins = "INSERT INTO Users (userFirstName, userLastName, userAddress, userPhone, userTypeId, userEmail, userPassword) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var inserts = [fFirstName, fLastName, fAddress, fPhone, fType, fEmail, fPassword];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('backEnd/insertFaculty.html');
        res.end();
    });
});

app.post('/insertClient/', function(req, res) {
    var cFirstName = req.body.clientFirstName;
    var cLastName = req.body.clientLastName;
    var cAddress = req.body.clientAddress;
    var cPhone = req.body.clientPhone;
    var cEmail = req.body.clientEmail;

    var sqlins = "INSERT INTO Clients (clientFirstName, clientLastName, clientAddress, clientPhone, clientEmail) VALUES (?, ?, ?, ?, ?)";
    var inserts = [cFirstName, cLastName, cAddress, cPhone, cEmail];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('backEnd/insertClients.html');
        res.end();
    });
});

app.post('/insertInventory/', function(req, res) {
    var itemId = req.body.iId;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var itemQty = req.body.itemQty;

    var sqlins = "INSERT INTO Inventory (InventoryId, InventoryQty) VALUES (?, ?)";
    var inserts = [itemId, itemQty];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record inserted");
        res.redirect('backEnd/insertInventory.html');
        res.end();
    });

    var sqlins2 = "INSERT INTO InventoryItems (InventoryItemId, InventoryItemName, InventoryItemDesc) VALUES (?, ?, ?)";
    var inserts2 = [itemId, itemName, itemDesc];
    var sql2 = mysql.format(sqlins2, inserts2);

    con.execute(sql2, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record inserted");
        res.end();
    });
});

app.post('/insertMenu/', function(req, res) {
    var itemId = req.body.mId;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var itemPrice = req.body.itemPrice;
    var itemSize = req.body.itemSize;

    var sqlins = "INSERT INTO MenuItems (ItemId, ItemName, ItemPrice, ItemDesc, itemSize) VALUES (?, ?, ?, ?, ?)";
    var inserts = [itemId, itemName, itemPrice, itemDesc, itemSize];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('backEnd/insertMenu.html');
        res.end();
    });
});

app.post('/insertOrder/', function(req, res) {
    var orderId = req.body.oId;
    var orderClient = req.body.currentOrderClient;
    var orderDay = req.body.currentOrderDate;
    var orderTime = req.body.currentOrderTime;
    var orderPrice = req.body.orderPrice;

    var sqlins = "INSERT INTO Orders (OrderId, OrderStatus, OrderDate, OrderTime, OrderClient, OrderPrice) VALUES (?, ?, ?, ?, ?, ?)";
    var inserts = [orderId, 1, orderDay, orderTime, orderClient, orderPrice];
    var sql = mysql.format(sqlins, inserts);
    
    console.log(sql);
    
    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.end();
    });
});

app.post('/insertOrderItems/', function(req, res) {
    var orderId = req.body.oId;
    var itemId = req.body.itemId;
    var itemName = req.body.itemName;
    var itemQty = req.body.itemQty;

    var sqlins = "UPDATE MenuItems SET ItemQty = ItemQty - ? WHERE ItemId = ?";
    var inserts = [itemQty, itemId];
    var sql = mysql.format(sqlins, inserts);

     con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.redirect('backEnd/insertOrders.html');
        res.end();
    });

    var sqlins2 = "INSERT INTO OrderItems (OrderId, MenuItemId, amountPurchased) VALUES (?, ?, ?)";
    var inserts2 = [orderId, itemName, itemQty];
    var sql2 = mysql.format(sqlins2, inserts2);
    console.log(sql2);
    con.execute(sql2, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.end();
    });
    });

app.post('/insertReservation/', function(req, res) {
    var reservationId = req.body.rId;
    var roomNumber = req.body.roomNumber;
    var resDay = req.body.resDay;
    var resTime = req.body.resTime;
    var resTrainer = req.body.resTrainer;
    var resClient = req.body.resClient;

    var sqlins = "INSERT INTO Reservations (ReservationId, ReservationRoom, ReservationDate, ReservationTime, TrainerId, clientId) VALUES (?, ?, ?, ?, ?, ?)";
    var inserts = [reservationId, roomNumber, resDay, resTime, resTrainer, resClient];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('backEnd/insertReservation.html');
        res.end();
    });
});

app.post('/updateClient/', function(req, res) {
    var cId = req.body.clientId;
    var cFirstName = req.body.clientFirstName;
    var cLastName = req.body.clientLastName;
    var cAddress = req.body.clientAddress;
    var cPhone = req.body.clientPhone;
    var cEmail = req.body.clientEmail;
    var cPassword = req.body.clientPassword;

    var sqlins = "UPDATE Clients SET clientFirstName = ?, clientLastName = ?, clientAddress = ?, clientPhone = ?, clientEmail = ?, clientPassword = ? WHERE clientId = ?";
    var inserts = [cFirstName, cLastName, cAddress, cPhone, cEmail, cPassword, cId];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.redirect('backEnd/updateClients.html');
        res.end();
    });
});

app.post('/updateOrder/', function(req, res) {
    var oId = req.body.oId;
    var orderStatus = req.body.orderStatus;
    var orderDate = req.body.orderDate;
    var orderTime = req.body.orderTime;
    var orderClient = req.body.orderClient;

    var sqlins = "UPDATE Orders SET OrderStatus = ?, OrderDate = ?, OrderTime = ?, OrderClient = ? WHERE OrderId = ?";
    var inserts = [orderStatus, orderDate, orderTime, orderClient,  oId];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.redirect('backEnd/updateOrders.html');
        res.end();
    });
});

app.post('/updateOrderItem/', function(req, res) {
    var oItemId = req.body.oItemId;
    var orderMenuItem = req.body.orderMenuItem;
    var orderQty = req.body.orderQty;
    var oId = req.body.oId;
    var priceChange = req.body.priceChange;

    var sqlins2 = "UPDATE MenuItems SET ItemQty = ItemQty - ? WHERE ItemId = ?";
    var inserts2 = [orderQty, orderMenuItem];

    var sql2 = mysql.format(sqlins2, inserts2);
    console.log(sql2);
    con.execute(sql2, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.redirect('backEnd/updateOrders.html');
        res.end();
    });

    if (priceChange != 0) {
        var sqlins = "UPDATE Orders SET OrderPrice = OrderPrice + ? WHERE OrderId = ?";
        var inserts = [priceChange, oId];
    
        var sql = mysql.format(sqlins, inserts);
        
        con.execute(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record updated");
            res.end();
        });
    }

    var sqlins = "UPDATE OrderItems SET OrderId = ?, MenuItemId = ?, amountPurchased = ? WHERE OrderItemsId = ?";
    var inserts = [oId, orderMenuItem, orderQty, oItemId];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.end();
    });
});

app.post('/updateFaculty/', function(req, res) {
    var fId = req.body.facultyId;
    var fFirstName = req.body.facultyFirstName;
    var fLastName = req.body.facultyLastName;
    var fAddress = req.body.facultyAddress;
    var fPhone = req.body.facultyPhone;
    var fType = req.body.facultyType;
    var fEmail = req.body.facultyEmail;
    var fPassword = req.body.facultyPassword;

    var sqlins = "UPDATE Users SET userFirstName = ?, userLastName = ?, userAddress = ?, userPhone = ?, userTypeId = ?, userEmail = ?, userPassword = ? WHERE userId = ?";
    var inserts = [fFirstName, fLastName, fAddress, fPhone, fType, fEmail, fPassword, fId];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.redirect('backEnd/updateFaculty.html');
        res.end();
    });
});

app.post('/updateMenu/', function(req, res) {
    var itemId = req.body.iId;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var itemPrice = req.body.itemPrice;
    var itemSize = req.body.itemSize;

    var sqlins = "UPDATE MenuItems SET ItemName = ?, ItemPrice = ?, ItemDesc = ?, ItemSize = ? WHERE ItemId = ?";
    var inserts = [itemName, itemPrice, itemDesc, itemSize, itemId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record updated");
        res.redirect('backEnd/updateMenu.html');
        res.end();
    });
});

app.post('/updateReservation/', function(req, res) {
    var reservationId = req.body.rId;
    var roomNumber = req.body.roomNumber;
    var resDay = req.body.resDay;
    var resTime = req.body.resTime;
    var resTrainer = req.body.resTrainer;
    var resClient = req.body.resClient;

    var sqlins = "UPDATE Reservations SET ReservationRoom = ?, ReservationDate = ?, ReservationTime = ?, TrainerId = ?, ClientId = ? WHERE ReservationId = ?";
    var inserts = [roomNumber, resDay, resTime, resTrainer, resClient, reservationId];
    var sql = mysql.format(sqlins, inserts);
    
    console.log(sql);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record updated");
        res.redirect('backEnd/updateReservations.html');
        res.end();
    });
});

app.post('/updateInventory/', function(req, res) {
    var itemId = req.body.iId;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var itemQty = req.body.itemQty;

    var sqlins = "UPDATE Inventory SET InventoryQty = ? WHERE InventoryId = ?";
    var inserts = [itemQty, itemId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record updated");
        res.redirect('backEnd/updateInventory.html');
        res.end();
    });

    var sqlins2 = "UPDATE InventoryItems SET InventoryItemName = ?, InventoryItemDesc = ? WHERE InventoryItemId = ?";
    var inserts2 = [itemName, itemDesc, itemId];
    var sql2 = mysql.format(sqlins2, inserts2);

    con.execute(sql2, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record updated");
        res.end();
    });
});

app.post('/deleteInventoryItem/', function(req, res) {
    var itemId = req.body.index;

    var sqlins = "Delete FROM InventoryItems WHERE InventoryItemId = ?";
    var inserts = [itemId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateInventory.html');
        res.end();
    });

    var sqlins = "Delete FROM Inventory WHERE InventoryId = ?";
    var inserts = [itemId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.end();
    });
});

app.post('/deleteOrder/', function(req, res) {
    var orderId = req.body.index;

    var sqlins = "Delete FROM OrderItems WHERE OrderId = ?";
    var inserts = [orderId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateOrders.html');
        res.end();
    });

    var sqlins = "Delete FROM Orders WHERE OrderId = ?";
    var inserts = [orderId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.end();
    });
});

app.post('/deleteOrderItem/', function(req, res) {
    var orderItemId = req.body.index;
    var priceChange = req.body.priceChange;
    var oId = req.body.oId;

    var sqlins = "UPDATE Orders SET OrderPrice = OrderPrice - ? WHERE OrderId = ?";
    var inserts = [priceChange, oId];
    var sql = mysql.format(sqlins, inserts);

    console.log(sql);
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateOrders.html');
        res.end();
    });

    var sqlins2 = "Delete FROM OrderItems WHERE OrderItemsId = ?";
    var inserts2 = [orderItemId];
    var sql2 = mysql.format(sqlins2, inserts2);
    
    con.execute(sql2, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.end();
    });
});

app.post('/deleteClient/', function(req, res) {
    var clientId = req.body.index;

    var sqlins = "Delete FROM Clients WHERE clientId = ?";
    var inserts = [clientId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateClients.html');
        res.end();
    });
});

app.post('/deletereservation/', function(req, res) {
    var resId = req.body.index;

    var sqlins = "Delete FROM Reservations WHERE ReservationId = ?";
    var inserts = [resId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateReservations.html');
        res.end();
    });
});


app.post('/deleteMenuItem/', function(req, res) {
    var itemId = req.body.index;

    var sqlins = "Delete FROM MenuItems WHERE ItemId = ?";
    var inserts = [itemId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateMenu.html');
        res.end();
    });
});

app.post('/deleteFaculty/', function(req, res) {
    var userId = req.body.index;

    var sqlins = "Delete FROM Users WHERE userId = ?";
    var inserts = [userId];
    var sql = mysql.format(sqlins, inserts);
    
    con.execute(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log("1 record deleted");
        res.redirect('backEnd/updateFaculty.html');
        res.end();
    });
});

app.get('/getMaxInventoryId/', function(req, res) {
    var sqlsel = "SELECT max(InventoryId) FROM Inventory";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMaxClientId/', function(req, res) {
    var sqlsel = "SELECT max(clientId) FROM Clients";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});


app.get('/getUserTypeId/', function(req, res) {
    var sqlsel = "SELECT userId, userFirstName FROM Users WHERE userTypeId = 3";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getUserTypes/', function(req, res) {
    var sqlsel = "SELECT typeName FROM UserTypes";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getClients/', function(req, res) {
    var sqlsel = "SELECT clientId, clientFirstName FROM Clients";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getAdminType/', function(req, res) {
    var aemail = req.query.aemail;

    var sqlsel = "SELECT userTypeId FROM Users Where userEmail = ?";
    var inserts = [aemail];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getClientById/', function(req, res) {
    var cId = req.query.clientId;
if (cId == "") {
    var sql = "SELECT * FROM Clients";
} else {
    var sqlsel = "SELECT * FROM Clients WHERE clientId = ?";
    var inserts = [cId];

    var sql = mysql.format(sqlsel, inserts);
}

    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getOrderById/', function(req, res) {
    var oId = req.query.orderId;
console.log(oId);    
if (oId == "") {
        var sql = "SELECT * FROM Orders";
    } else {

        var sqlsel = "SELECT * FROM Orders WHERE OrderId = ?";
        var inserts = [oId];

        var sql = mysql.format(sqlsel, inserts);
    };


    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getOrderItemById/', function(req, res) {
    var oId = req.query.orderItemId;

    var sqlsel = "SELECT * FROM OrderItems WHERE OrderItemsId = ?";
    var inserts = [oId];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getReservationById/', function(req, res) {
    var rId = req.query.reservationId;
    if (rId == "") {
        var sql = "SELECT * FROM Reservations";
    } else {
        var sqlsel = "SELECT * FROM Reservations WHERE ReservationId = ?";
        var inserts = [rId];
    
        var sql = mysql.format(sqlsel, inserts);
    }
    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getFacultyById/', function(req, res) {
    var fId = req.query.facultyId;

    if (fId == "") {
        var sql = "SELECT * FROM Users";
    } else {

        var sqlsel = "SELECT * FROM Users WHERE userId = ?";
        var inserts = [fId];

        var sql = mysql.format(sqlsel, inserts);
    }

    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMenuById/', function(req, res) {
    var mId = req.query.mId;

    if (mId == "") {
        var sql = "SELECT * FROM MenuItems";
    } else {
        var sqlsel = "SELECT * FROM MenuItems WHERE ItemId = ?";
        var inserts = [mId];

        var sql = mysql.format(sqlsel, inserts);
    }
    console.log(sql);
    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getInventoryById/', function(req, res) {
    var iId = req.query.iId;

    if (!iId) {
        var sql = "SELECT InventoryId, InventoryItems.InventoryItemName, InventoryItems.InventoryItemDesc, InventoryQty FROM Inventory "
        +'INNER JOIN InventoryItems on InventoryItems.InventoryItemId = Inventory.InventoryId';
    } else {
        var sqlsel = "SELECT InventoryQty, InventoryItems.InventoryItemName, InventoryItems.InventoryItemDesc FROM Inventory "
        +'INNER JOIN InventoryItems on InventoryItems.InventoryItemId = Inventory.InventoryId '
        +'WHERE InventoryId = ?';
        var inserts = [iId];
    
        var sql = mysql.format(sqlsel, inserts);
    }
    
    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getRooms/', function(req, res) {
    var sqlsel = "SELECT roomId, roomNumber FROM resRooms";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getStatus/', function(req, res) {
    var sqlsel = "SELECT * FROM OrderStatus";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMaxMenuId/', function(req, res) {
    var sqlsel = "SELECT max(ItemId) FROM MenuItems";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMenuItems/', function(req, res) {
    var sqlsel = "SELECT * FROM MenuItems";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getSize/', function(req, res) {
    var sqlsel = "SELECT * FROM sizeType";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMaxOrderId/', function(req, res) {
    var sqlsel = "SELECT max(OrderId) FROM Orders";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/getMaxReservationId/', function(req, res) {
    var sqlsel = "SELECT max(ReservationId) FROM Reservations";

    con.query(sqlsel, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    });
});

app.get('/searchFaculty/', function(req, res) {
    var fFirstName = req.query.facultyFirstNameSearch;
    var fLastName = req.query.facultyLastNameSearch;
    var fEmail = req.query.facultyEmailSearch;

    var sqlins = 'SELECT userFirstName, userLastName, userEmail, userTypeId FROM Users WHERE userFirstName like ? and userLastName like ? and userEmail Like ? and userTypeId >= 2 ORDER BY userFirstName ASC';
    var inserts = ['%'+fFirstName+'%', '%'+fLastName+'%', '%'+fEmail+'%'];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchReservation/', function(req, res) {
    var roomNumber = req.query.roomNumber;
    var resDay = req.query.resDay;
    var resTime = req.query.resTime;
    var resTrainer = req.query.resTrainer;
    var resClient = req.query.resClient;

    var sqlins = "SELECT ReservationRoom, ReservationDate, ReservationTime, TrainerId, clientId FROM Reservations WHERE ReservationRoom like ? and ReservationDate like ? and ReservationTime like ? and TrainerId like ? and clientId like ?";
    var inserts = ['%'+roomNumber+'%', '%'+resDay+'%', '%'+resTime+'%', '%'+resTrainer+'%', '%'+resClient+'%'];
    var sql = mysql.format(sqlins, inserts);
    
    con.query(sql, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchInventory/', function(req, res) {
    var iId = req.query.iId;
    var itemName = req.query.itemName;
    var itemDesc = req.query.itemDesc;
    var itemQty = req.query.itemQty;

    var sqlins = 'SELECT InventoryQty, InventoryItems.InventoryItemId, InventoryItems.InventoryItemName, InventoryItems.InventoryItemDesc FROM Inventory '
    +'inner join InventoryItems on InventoryItems.InventoryItemId = Inventory.InventoryId '
    +'WHERE InventoryItems.InventoryItemId Like ? and InventoryItemName Like ? and InventoryItemDesc Like ? and InventoryQty Like ?';
    var inserts = ['%'+iId+'%', '%'+itemName+'%', '%'+itemDesc+'%', '%'+itemQty+'%'];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/searchClientItems/', function(req, res) {
    var orderId = req.query.orderItemsId;

    var sqlins = "SELECT OrderItemsId, MenuItemId, amountPurchased FROM OrderItems WHERE OrderId like ?";
    var inserts = ['%'+orderId+'%'];
    var sql = mysql.format(sqlins, inserts);

    console.log(sql);
    
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchOrders/', function(req, res) {
    var orderId = req.query.orderId;
    var orderClient = req.query.orderClient;
    var orderDay = req.query.orderDay;
    var orderTime = req.query.orderTime;
    var orderStatus = req.query.orderStatus;

    var orderIdSQL = "orderId = ?";
    var orderIdINS = orderId;
    var orderClientSQL = "orderClient = ?";
    var orderClientINS = orderClient;

    if (!orderClient) {
        orderClientSQL = "orderClient like ?";
        orderClientINS = "%%"
    } if (!orderId) {
        orderIdSQL = "orderId like ?";
        orderIdINS = "%%"
    }

    var sqlins = "SELECT * FROM Orders WHERE "+orderIdSQL+" and "+orderClientSQL+" and orderDate like ? and orderTime like ? and orderStatus like ?";
    var inserts = [orderIdINS, orderClientINS, '%'+orderDay+'%', '%'+orderTime+'%', '%'+orderStatus+'%'];
    var sql = mysql.format(sqlins, inserts);

    console.log(sql)
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchMenu/', function(req, res) {
    var itemName = req.query.itemName;
    var itemDesc = req.query.itemDesc;
    var itemPrice = req.query.itemPrice;
    var itemSize = req.query.itemSize;
    var itemQty = req.query.itemQty;

    var sqlins = "SELECT ItemName, ItemDesc, ItemPrice, ItemSize, ItemQty FROM MenuItems WHERE ItemName like ? and ItemDesc Like ? and ItemPrice like ? and ItemSize like ? and ItemQty like ?"
    +" ORDER BY ItemName ASC";
    var inserts = ['%'+itemName+'%', '%'+itemDesc+'%', '%'+itemPrice+'%', '%'+itemSize+'%', '%'+itemQty+'%'];
    var sql = mysql.format(sqlins, inserts);

    console.log(sql)
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchClients/', function(req, res) {
    var cFirstName = req.query.clientFirstNameSearch;
    var cLastName = req.query.clientLastNameSearch;
    var cEmail = req.query.clientEmailSearch;

    var sqlins = 'SELECT clientFirstName, clientLastName, clientEmail FROM Clients WHERE clientFirstName like ? and clientLastName like ? and clientEmail Like ? ORDER BY clientFirstName ASC';
    var inserts = ['%'+cFirstName+'%', '%'+cLastName+'%', '%'+cEmail+'%'];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/frontEnd/homepage.html');
});