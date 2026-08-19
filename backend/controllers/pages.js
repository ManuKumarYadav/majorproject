module.exports.renderPrivacy = (req, res) => {
    res.render("pages/privacy.ejs", {
        title: "Privacy Policy | StayAira",
        pageName: "privacy"
    });
};

module.exports.renderTerms = (req, res) => {
    res.render("pages/terms.ejs", {
        title: "Terms of Service | StayAira",
        pageName: "terms"
    });
};

module.exports.renderHelp = (req, res) => {
    res.render("pages/help.ejs", {
        title: "Help Center & FAQs | StayAira",
        pageName: "help"
    });
};

module.exports.renderAircover = (req, res) => {
    res.render("pages/aircover.ejs", {
        title: "AirCover Support | StayAira",
        pageName: "aircover"
    });
};

module.exports.renderSafety = (req, res) => {
    res.render("pages/safety.ejs", {
        title: "Safety Information | StayAira",
        pageName: "safety"
    });
};

module.exports.renderCancellation = (req, res) => {
    res.render("pages/cancellation.ejs", {
        title: "Cancellation Options | StayAira",
        pageName: "cancellation"
    });
};

module.exports.renderResources = (req, res) => {
    res.render("pages/resources.ejs", {
        title: "Hosting Resources & Academy | StayAira",
        pageName: "resources"
    });
};

module.exports.renderCommunity = (req, res) => {
    res.render("pages/community.ejs", {
        title: "Host Community Forum | StayAira",
        pageName: "community"
    });
};

module.exports.renderInsurance = (req, res) => {
    res.render("pages/insurance.ejs", {
        title: "Host Protection & Insurance | StayAira",
        pageName: "insurance"
    });
};

module.exports.renderSitemap = (req, res) => {
    res.render("pages/sitemap.ejs", {
        title: "Sitemap | StayAira",
        pageName: "sitemap"
    });
};
