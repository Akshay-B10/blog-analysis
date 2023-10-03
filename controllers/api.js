const _ = require("lodash");

async function getBlogs() {
    try {
        const options = {
            method: "GET",
            headers: {
                "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
            }
        }
        const response = await fetch("https://intent-kit-16.hasura.app/api/rest/blogs", options);
        if (response.status !== 200) {
            throw ({ status: 400, message: "Could not fetch blogs" });
        }
        const blogData = await response.json();
        if (blogData.blogs) {
            return blogData.blogs;
        }
        throw ({ status: 404, message: "Blogs not found" });
    } catch (err) {
        throw (err);
    }
}

exports.blogStats = async (req, res) => {
    try {
        const blogs = await getBlogs(); // Array of objects
        const blogWithLongestTitle = _.maxBy(blogs, blog => blog.title.length);
        const blogsWithPrivacyInTitle = _.filter(blogs, blog => _.includes(_.toLower(blog.title), "privacy"));
        const blogsWithUniqueTitle = _.uniqBy(blogs, "title");
        res.json({
            total_blogs: blogs.length || 0,
            longest_title: blogWithLongestTitle.title,
            blogs_with_privacy_in_title: blogsWithPrivacyInTitle.length,
            blogs_with_unique_title: blogsWithUniqueTitle
        });
    } catch (err) {
        if (!err.status) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
        res.status(err.status).json({
            message: err.message
        });
    }
};

exports.blogSearch = async (req, res) => {
    try {
        const blogs = await getBlogs();
        const filterQuery = req.query.query;
        const filteredBlogs = _.filter(blogs, blog => _.includes(_.toLower(blog.title), filterQuery));
        res.json({
            query_result: filteredBlogs
        });
    } catch (err) {
        if (!err.status) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
        res.status(err.status).json({
            message: err.message
        });
    }
};