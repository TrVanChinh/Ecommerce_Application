require("dotenv").config()
//mongodb user model
const Category = require('../models/Category')

//creact category
exports.NewCategory = async (req, res) => {
    let { name } = req.body
    if (name === '') {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else {
        try {
            const newCategory = new Category({
                name: name,
                subCategory: []
            });

            await newCategory.save();
            res.status(200).json({ message: "Category created Successfully" });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tạo category:", error);
            throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
        }
    }
}
// update category
exports.UpdateCategory = async (req, res) => {
    const { categoryId, name } = req.body;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.name = name;
        await category.save();
        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//delete category
exports.DeleteCategory = async (req, res) => {
    const { categoryId } = req.body;
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//creact SubCategory
exports.CreateSubCategory = async (req, res) => {
    let { name, categoryId } = req.body
    if (name === '' || categoryId === '') {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Cannot find category with providing Id');
            }
            category.subCategory.push({ name: name });
            await category.save();
            res.status(200).json({ message: "SubCategory created Successfully" });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tạo subcategory:", error);
            throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
        }
    }
}

//update Subcategory
exports.UpdateSubCategory = async (req, res) => {
    const { categoryId, subCategoryId, newName } = req.body;
    try {
        const category = await Category.findOne({ "_id": categoryId });
        if (!category) {
            return res.status(404).json({ message: "sscategory not found" });
        }
        const subCategory = category.subCategory.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        subCategory.name = newName;
        await category.save();
        res.status(200).json({ message: "Subcategory updated successfully" });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//delete subcategory
exports.DeleteSubCategory = async (req, res) => {
    const { subCategoryId, categoryId } = req.body;
    try {
        const category = await Category.findOne({ "_id": categoryId });
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        }
        category.subCategory.pull({ _id: subCategoryId });
        await category.save();
        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Show category
exports.ShowCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            status: 'SUCCESS',
            message: 'List of categories',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
}

// Show one category
// exports.ShowOneCategory = async (req, res) => {
//     const { categoryId } = req.body 
//     try {
//         const categories = await Category.findOne({ "_id": categoryId });
//         res.json({
//             status: 'SUCCESS',
//             message: 'get categories',
//             data: categories
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'FAILED',
//             message: 'Failed to fetch categories',
//             error: error.message
//         });
//     }
// }

exports.ShowOneCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ "_id": id });
        if (!category) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Category not found'
            });
        }
        res.json({
            status: 'SUCCESS',
            message: 'Category found',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch category',
            error: error.message
        });
    }
}

//show subCategory
exports.showSubCategory = async (req, res) => {
    let { categoryId, subCategoryId } = req.body;
    try {
        const category = await Category.findOne({ "_id": categoryId });
        if (!category) {
            return res.status(404).json({ message: "sscategory not found" });
        }
        const subCategory = category.subCategory.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.json({
            status: 'SUCCESS',
            message: 'Category found',
            data: subCategory
        });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getSubCategory = async (req, res) => {
    let { id, subCategoryId } = req.params;
    try {
        const category = await Category.findOne({ "_id": id });
        if (!category) {
            return res.status(404).json({ message: "sscategory not found" });
        }
        const subCategory = category.subCategory.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.json({
            status: 'SUCCESS',
            message: 'Category found',
            data: subCategory
        });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}