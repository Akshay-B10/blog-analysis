const _ = require("lodash");

exports.blogStats = async (req, res) => {
    try {
        const options = {
            method: "GET",
            headers: {
                "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
            }
        }
        const response = await fetch("https://intent-kit-16.hasura.app/api/rest/blogs", options);
        if (response.status !== 200) {
            throw ({ status: response.status, message: "Could not fetch blogs" });
        }
        const blogData = await response.json();
        const blogs = blogData.blogs; // Array of objects
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
        res.status(err.status).json({
            message: err.message
        });
    }
};