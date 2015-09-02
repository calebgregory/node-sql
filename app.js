var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Northwind.sl3');

var getCategories = () => {
  db.run('', () => {
    console.log(' ============\n',
                '> Categories\n',
                '============');
  });

  db.each('SELECT * FROM Categories',
    (err,row) => {
      console.log(row.Description.toString());
    });
};

var getProducts = () => {
  db.run('', () => {
    console.log(' ==========\n',
                '> Products\n',
                '==========');
  });

  db.each('SELECT * FROM Products '+
          'INNER JOIN Categories '+
          'ON Products.CategoryID = Categories.CategoryID '+
          'LIMIT 10',
    (err,row) => {
      console.log(`${row.ProductName} is a ${row.CategoryName}`);
    });
};

var getEmployeeSupers = () => {
  db.run('', () => {
    console.log(' ======================\n',
                '> Employee Supervisors\n',
                '======================');
  });

  db.each('SELECT e.LastName as employee, m.LastName as reports_to '+
          'FROM Employees AS e '+
          'LEFT OUTER JOIN Employees AS m ON e.ReportsTo = m.EmployeeID',
         (err,row) => {
           if(!row.reports_to) return console.log(`${row.employee} reports to no one`);
           console.log(`${row.employee}'s supervisor is ${row.reports_to}`);
         });
};

var createCategoryFavoritesTable = () => {
  db.run('', () => {
    console.log(' ++++++++++++++++++++++++++++++\n',
                '> New Category Favorites Table\n',
                '++++++++++++++++++++++++++++++');
  });

  db.run('DROP TABLE IF EXISTS "Category Favorites";');

  db.run('CREATE TABLE [Category Favorites] ('+
         'FavoriteID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, '+
         'CategoryID INT  NOT NULL'+
         ');', err => {
    if(err) console.log(err);
  });
};

var insertDataIntoCategoryFavoritesTable = () => {
  db.run('', () => {
    console.log(' +++++++++++++++++++++++++++++++\n',
                '> Inserting Data Into ^ Table ^\n',
                '+++++++++++++++++++++++++++++++');
  });

  var stmt = db.prepare('INSERT INTO "Category Favorites" (CategoryID) VALUES (?)');
  for(var i = 2; i < 9; i+=2) stmt.run(i);
  stmt.finalize();
};

var getCategoryFavoritesDescriptions = () => {
  db.run('', () => {
    console.log(' ================================\n',
                '> Favorite Category Descriptions\n',
                '================================');
  });

  db.each('SELECT CF.FavoriteID AS fav, C.Description AS desc '+
          'FROM "Category Favorites" AS CF '+
          'INNER JOIN Categories AS C '+
          'ON C.CategoryID = CF.CategoryID;',
    (err,row) => {
      if(err) console.log(err);
      console.log(`FavoriteID: ${row.fav}, Description: ${row.desc}`);
    });
};

var setNewFavoriteCategoryOn2 = () => {
  db.run('', () => {
    console.log(' ++++++++++++++++++++++++++++++++++++\n',
                '> Updating FavID:2 with new Category\n',
                '++++++++++++++++++++++++++++++++++++');
  });

  db.run('UPDATE "Category Favorites" '+
         'SET CategoryID = 5 '+
         'WHERE FavoriteID = 2');
};

var insertNewRowWithCategoryId1 = () => {
  db.run('', () => {
    console.log(' ++++++++++++++++++++++++++++++++++++++\n',
                '> Inserting New Row with CategoryID: 1\n',
                '++++++++++++++++++++++++++++++++++++++');
  });

  db.run('INSERT INTO "Category Favorites" '+
         '(CategoryID) '+
         'VALUES (1)')
}

db.serialize(() => {
  getCategories();
  getProducts();
  getEmployeeSupers();
  createCategoryFavoritesTable();
  insertDataIntoCategoryFavoritesTable();
  getCategoryFavoritesDescriptions();
  setNewFavoriteCategoryOn2();
  getCategoryFavoritesDescriptions();
  insertNewRowWithCategoryId1();
  getCategoryFavoritesDescriptions();

  db.close();
});
