const Portfolio = require("../models/Portfolio");
const Resume = require("../models/Resume");

// ==========================
// Get Logged-in User's Portfolio
// ==========================
const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Create or Update Portfolio
// ==========================
const createOrUpdatePortfolio = async (req, res) => {
  try {
    const { subdomain, title, theme, themeColor, personalInfo, skills, experience, education, projects } = req.body;

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: "Subdomain is required.",
      });
    }

    // Check if subdomain is already taken by another user
    const existing = await Portfolio.findOne({ subdomain: subdomain.toLowerCase() });
    if (existing && existing.user.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Subdomain is already taken.",
      });
    }

    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (portfolio) {
      // Update
      portfolio.subdomain = subdomain.toLowerCase();
      portfolio.title = title || portfolio.title;
      portfolio.theme = theme || portfolio.theme;
      portfolio.themeColor = themeColor || portfolio.themeColor;
      portfolio.personalInfo = personalInfo || portfolio.personalInfo;
      portfolio.skills = skills || portfolio.skills;
      portfolio.experience = experience || portfolio.experience;
      portfolio.education = education || portfolio.education;
      portfolio.projects = projects || portfolio.projects;
      await portfolio.save();
    } else {
      // Create
      portfolio = await Portfolio.create({
        user: req.user.id,
        subdomain: subdomain.toLowerCase(),
        title: title || "My Portfolio Website",
        theme: theme || "modern",
        themeColor: themeColor || "blue",
        personalInfo: personalInfo || {},
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        projects: projects || [],
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Portfolio by Subdomain (Public view)
// ==========================
const getPortfolioBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;

    const portfolio = await Portfolio.findOneAndUpdate(
      { subdomain: subdomain.toLowerCase() },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Convert Resume to Portfolio
// ==========================
const convertResumeToPortfolio = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { subdomain } = req.body;

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: "A subdomain is required for the portfolio site.",
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Check if subdomain is already taken
    const existing = await Portfolio.findOne({ subdomain: subdomain.toLowerCase() });
    if (existing && existing.user.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Subdomain is already taken.",
      });
    }

    let portfolio = await Portfolio.findOne({ user: req.user.id });

    const newPortfolioData = {
      subdomain: subdomain.toLowerCase(),
      title: `${resume.personalInfo?.fullName || "My"} Portfolio`,
      theme: "modern",
      themeColor: resume.themeColor || "blue",
      personalInfo: {
        fullName: resume.personalInfo?.fullName || "",
        headline: resume.personalInfo?.headline || "",
        photo: resume.personalInfo?.photo || "",
        email: resume.personalInfo?.email || "",
        phone: resume.personalInfo?.phone || "",
        address: resume.personalInfo?.address || "",
        linkedin: resume.personalInfo?.linkedin || "",
        github: resume.personalInfo?.github || "",
        summary: resume.personalInfo?.summary || "",
      },
      skills: resume.skills || [],
      experience: (resume.experience || []).map((exp) => ({
        company: exp.company || "",
        position: exp.position || "",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        currentlyWorking: exp.currentlyWorking || false,
        description: exp.description || "",
      })),
      education: (resume.education || []).map((edu) => ({
        college: edu.college || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.fieldOfStudy || "",
        startYear: edu.startYear || "",
        endYear: edu.endYear || "",
        cgpa: edu.cgpa || "",
      })),
      projects: (resume.projects || []).map((proj) => ({
        title: proj.title || "",
        description: proj.description || "",
        technologies: proj.technologies || [],
        github: proj.github || "",
        liveDemo: proj.liveDemo || "",
      })),
    };

    if (portfolio) {
      // Update existing portfolio
      Object.assign(portfolio, newPortfolioData);
      await portfolio.save();
    } else {
      // Create new portfolio
      portfolio = await Portfolio.create({
        user: req.user.id,
        ...newPortfolioData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume converted to Portfolio successfully!",
      portfolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMyPortfolio,
  createOrUpdatePortfolio,
  getPortfolioBySubdomain,
  convertResumeToPortfolio,
};
