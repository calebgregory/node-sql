var pg = require('pg');
var conString = 'postgres://localhost/Northwind';

var client = new pg.Client(conString);

var t1 = client.query('');
t1.on('end', () => {
  console.log(' ============\n',
              '> Categories\n',
              '============');
});

var q1 = 'SELECT * FROM Categories'
var getCategories = client.query(q1);
getCategories
  .on('error', err => {
    console.error(err);
  })
  .on('row', row => {
    console.log(row.Description.toString());
  });

var t2 = client.query('');
t2.on('end', () => {
  console.log(' ==========\n',
              '> Products\n',
              '==========');
});

var q2 = 'SELECT * FROM Products AS P '+
          'INNER JOIN Categories AS C '+
          'ON (P."CategoryID" = C."CategoryID") '+
          'LIMIT 10';
var getProducts = client.query(q2);
getProducts
  .on('error', err => {
    console.error(err);
  })
  .on('row', row => {
    console.log(`${row.ProductName} is a ${row.CategoryName}`);
  });

var t3 = client.query('');
t3.on('end', () => {
  console.log(' ======================\n',
              '> Employee Supervisors\n',
              '======================');
});

var q3 = 'SELECT e."LastName" as employee, m."LastName" as reports_to '+
          'FROM Employees AS e '+
          'LEFT OUTER JOIN Employees AS m ON e."ReportsTo" = m."EmployeeID"';
var getEmployeeSupers = client.query(q3);
getEmployeeSupers
  .on('error', err => {
    console.error(err);
  })
  .on('row', row => {
    if(!row.reports_to) return console.log(`${row.employee} reports to no one`);
    console.log(`${row.employee}'s supervisor is ${row.reports_to}`);
  });

var t4 = client.query('')
t4.on('end', () => {
  console.log(' ++++++++++++++++++++++++++++++\n',
              '> New Category Favorites Table\n',
              '++++++++++++++++++++++++++++++');
});

var q4 = 'DROP TABLE IF EXISTS "Category Favorites"; '+
         'CREATE TABLE "Category Favorites" ('+
         '"FavoriteID" SERIAL PRIMARY KEY NOT NULL, '+
         '"CategoryID" INT  NOT NULL'+
         ');';
var createCategoryFavoritesTable = client.query(q4);
createCategoryFavoritesTable
  .on('error', err => {
    console.error(err);
  })
  .on('end', () => {
    console.log('( Success )');
  });

var t5 = client.query('');
t5.on('end', () => {
  console.log(' +++++++++++++++++++++++++++++++\n',
              '> Inserting Data Into ^ Table ^\n',
              '+++++++++++++++++++++++++++++++');
});

var q5 = 'INSERT INTO "Category Favorites" ("CategoryID") '+
         'VALUES (2),(4),(6),(8);';
var insertDataIntoCategoryFavoritesTable = client.query(q5);
insertDataIntoCategoryFavoritesTable
  .on('error', err => {
    console.error(err);
  })
  .on('end', () => {
    console.log('( Success )');
  });

var t6 = client.query('')
t6.on('end', () => {
  console.log(' ================================\n',
              '> Favorite Category Descriptions\n',
              '================================');
});

var getCategoryFavoritesDescriptions = () => {
  var q6 = 'SELECT CF."FavoriteID" AS fav, C."Description" AS desc '+
           'FROM "Category Favorites" AS CF '+
           'INNER JOIN Categories AS C '+
           'ON C."CategoryID" = CF."CategoryID";';
  return client.query(q6)
    .on('error', err => {
      console.error(err);
    })
    .on('row', row => {
      console.log(`FavoriteID: ${row.fav}, Description: ${row.desc}`);
    });
};

getCategoryFavoritesDescriptions()

var t7 = client.query('');
t7.on('end', () => {
  console.log(' ++++++++++++++++++++++++++++++++++++\n',
              '> Updating FavID:2 with new Category\n',
              '++++++++++++++++++++++++++++++++++++');
});

var q7 = 'UPDATE "Category Favorites" '+
         'SET "CategoryID" = 5 '+
         'WHERE "FavoriteID" = 2';
var setNewFavoriteCategoryOn2 = client.query(q7);
setNewFavoriteCategoryOn2
  .on('error', err => {
    console.error(err);
  })
  .on('end', row => {
    console.log('( Success )');
  });

getCategoryFavoritesDescriptions();

var t8 = client.query('');
t8.on('end', () => {
  console.log(' ------------------------\n',
              '> Deleting FavoriteID: 3\n',
              '------------------------');
});

var q8 = 'DELETE FROM "Category Favorites" AS CF '+
         'WHERE CF."FavoriteID" = 3';
var deleteFavId3 = client.query(q8);
deleteFavId3
  .on('error', err => {
    console.error(err);
  })
  .on('end', () => {
    console.log('( Success )');
  });

getCategoryFavoritesDescriptions();

var t8 = client.query('');
t8.on('end', () => {
  console.log(' ++++++++++++++++++++++++++++++++++++++\n',
              '> Inserting New Row with CategoryID: 1\n',
              '++++++++++++++++++++++++++++++++++++++');
});

var q8 = 'INSERT INTO "Category Favorites" '+
         '("CategoryID") '+
         'VALUES (1)';
var insertNewRowWithCategoryId1 = client.query(q8);
insertNewRowWithCategoryId1
  .on('error', err => {
    console.error(err);
  })
  .on('end', row => {
    console.log('( Success )');
  });

getCategoryFavoritesDescriptions()

client.on('drain', client.end.bind(client));

client.connect();

//pg.connect(conString, (err, client, done) => {
  //if(err) return console.error('>>> error fetching client from pool\n',err);
  //client.query('BEGIN', err => {
    //if (err) return rollback(client, done);

    //process.nextTick(() => {
      //var text = 'INSERT INTO '
    //})
  //});
//});
