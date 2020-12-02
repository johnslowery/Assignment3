"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatArray = exports.Category = void 0;
var Category = /** @class */ (function () {
    function Category(categoryId, name, description) {
        this.categoryId = 0;
        this.name = '';
        this.description = '';
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
    }
    return Category;
}());
exports.Category = Category;
var CatArray = [];
exports.CatArray = CatArray;
