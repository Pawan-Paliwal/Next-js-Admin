-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 02:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chanderpur_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `mst_awarddata`
--

CREATE TABLE `mst_awarddata` (
  `AwardLogoID` int(11) NOT NULL,
  `AwardLogoImage` varchar(255) DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT '',
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mst_awarddata`
--

INSERT INTO `mst_awarddata` (`AwardLogoID`, `AwardLogoImage`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(3, 'award-logo-1777093832461-18245.ico', 1, 1, '2026-04-25 10:40:32', 'Admin Panel', '2026-05-14 15:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `mst_blogdata`
--

CREATE TABLE `mst_blogdata` (
  `BlogID` int(11) NOT NULL,
  `BlogName` varchar(255) NOT NULL,
  `BlogNameURL` varchar(255) NOT NULL,
  `BlogImage` varchar(255) NOT NULL,
  `BlogBannerImage` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `DisplayOrder` int(11) DEFAULT NULL,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` varchar(500) DEFAULT NULL,
  `MetaDescriptions` varchar(2000) DEFAULT NULL,
  `MetaSchema` varchar(5000) DEFAULT NULL,
  `PostedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_blogdata`
--

INSERT INTO `mst_blogdata` (`BlogID`, `BlogName`, `BlogNameURL`, `BlogImage`, `BlogBannerImage`, `Description`, `ActiveStatus`, `DisplayOrder`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'The Future of Manufacturing: Trends Shaping the Next Decade', 'the-future-of-manufacturing-trends-shaping-the-next-decade', 'the-future-of-manufacturing-trends-shaping-the-next-decade.svg', 'the-future-of-manufacturing-trends-shaping-the-next-decade-banner.svg', '<p>Lorem ipsum dolor sit amet consectetur. Maecenas vel fringilla felis faucibus arcu in ultrices quam aliquam. Sed faucibus libero at tincidunt amet sed rhoncus. Pulvinar vitae viverra interdum orci mauris facilisis libero aenean amet. Viverra eu feugiat eu placerat dui auctor. Est gravida sit euismod aenean. At sit risus auctor nisi. Mi ornare faucibus at enim sed egestas. Mauris pretium enim proin nam fames. Est risus ut amet a tincidunt tincidunt ut ultricies. Velit arcu at at nullam leo sodales egestas aenean sed. Placerat sit elit aliquam lectus quis odio mattis enim. Laoreet habitant felis praesent in augue sagittis. Non in ut at elementum viverra quam duis non metus.Et egestas facilisis libero orci sed mauris massa erat. Egestas fusce bibendum dolor condimentum neque. Feugiat commodo ut erat ipsum faucibus lacus libero. Ullamcorper a odio mi volutpat id ut urna. Nulla facilisi tristique lorem tellus lectus a. Condimentum tempus leo eu at vitae purus est cras eget. Vel varius orci tempus aliquam.</p><div class=\"se-component se-image-container __se__float-none\"><figure><img alt=\"\" src=\"/image/insight/image.svg\" data-proportion=\"true\" data-align=\"none\" data-file-name=\"image.svg\" data-file-size=\"0\" data-origin=\",\" data-size=\",\" data-rotate=\"\" data-percentage=\"auto,auto\" style=\"\"></figure></div><h3>Lorem ipsum dolor sit amet consectetur. </h3><p>Lorem ipsum dolor sit amet consectetur. Maecenas vel fringilla felis faucibus arcu in ultrices quam aliquam. Sed faucibus libero at tincidunt amet sed rhoncus. Pulvinar vitae viverra interdum orci mauris facilisis libero aenean amet. Viverra eu feugiat eu placerat dui auctor. Est gravida sit euismod aenean. At sit risus auctor nisi. Mi ornare faucibus at enim sed egestas. Mauris pretium enim proin nam fames. Est risus ut amet a tincidunt tincidunt ut ultricies. Velit arcu at at nullam leo sodales egestas aenean sed. Placerat sit elit aliquam lectus quis odio mattis enim. Laoreet habitant felis praesent in augue sagittis. Non in ut at elementum viverra quam duis non metus.Et egestas facilisis libero orci sed mauris massa erat. Egestas fusce bibendum dolor condimentum neque. Feugiat commodo ut erat ipsum faucibus lacus libero. Ullamcorper a odio mi volutpat id ut urna. Nulla facilisi tristique lorem tellus lectus a. Condimentum tempus leo eu at vitae purus est cras eget. Vel varius orci tempus aliquam.</p>', 1, 1, 'The Future of Manufacturing: Trends Shaping the Next Decade | Chanderpur', '', '', '', '2026-04-25 06:24:11', 'Admin Panel', '2026-04-25 06:51:15');

-- --------------------------------------------------------

--
-- Table structure for table `mst_careerdata`
--

CREATE TABLE `mst_careerdata` (
  `CareerID` int(11) NOT NULL,
  `CareerName` varchar(255) NOT NULL,
  `CareerDescription` text DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `CareerType` varchar(100) DEFAULT NULL,
  `DisplayOrder` int(11) DEFAULT 0,
  `ActiveStatus` int(11) DEFAULT 1,
  `PostedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_careerdata`
--

INSERT INTO `mst_careerdata` (`CareerID`, `CareerName`, `CareerDescription`, `Location`, `CareerType`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Oracle EBS Techno-functional / Information Technology (IT)', '<h1>Full Stack Developer</h1><p><strong>Company:</strong> ABC Technologies</p><p><strong>Location:</strong> New Delhi, India</p><p><strong>Experience:</strong> 2+ Years</p><p><strong>Job Type:</strong> Full-Time</p><p>        We are looking for a skilled and passionate Full Stack Developer to join our growing development team.        The ideal candidate should have experience in frontend and backend development and be able to build        scalable web applications.    </p><h2>Key Responsibilities</h2><h2>Required Skills</h2><h2>Qualifications</h2><h2>Benefits</h2><p>        Interested candidates can apply by sending their updated resume to        <strong>careers@abctech.com</strong>.    </p><div> <ul><li>Develop and maintain web applications using modern technologies.</li><li>Build responsive and user-friendly frontend interfaces.</li><li>Create and manage backend APIs and database systems.</li><li>Collaborate with designers, developers, and project managers.</li><li>Debug, optimize, and improve application performance.</li></ul> <ul><li>Strong knowledge of HTML, CSS, JavaScript, and React.js.</li><li>Experience with Node.js and Express.js.</li><li>Knowledge of MongoDB or MySQL databases.</li><li>Understanding of REST APIs and Git version control.</li><li>Good problem-solving and communication skills.</li></ul> <ul><li>Bachelor’s degree in Computer Science or related field.</li><li>Minimum 2 years of relevant experience.</li></ul> <ul><li>Competitive salary package.</li><li>Flexible work environment.</li><li>Career growth opportunities.</li><li>Health and paid leave benefits.</li></ul> </div>', 'Yamunanagar (Haryana) and Noida (Uttar Pradesh)', 'Full time (Work from office)', 1, 1, '2026-05-12 11:46:51', 'Admin Panel', '2026-05-12 17:24:47');

-- --------------------------------------------------------

--
-- Table structure for table `mst_categorydata`
--

CREATE TABLE `mst_categorydata` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `CategoryNameURL` varchar(255) NOT NULL,
  `CategoryImage` varchar(255) DEFAULT NULL,
  `CategoryBannerImage` varchar(255) DEFAULT NULL,
  `SmallDescription` varchar(5000) DEFAULT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `DisplayOnHeader` int(11) NOT NULL,
  `DisplayOnHome` int(11) NOT NULL,
  `DisplayOnSearchBy` int(11) NOT NULL,
  `DisplayOrder` int(11) NOT NULL,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` varchar(500) DEFAULT NULL,
  `MetaDescriptions` varchar(2000) DEFAULT NULL,
  `MetaSchema` varchar(5000) DEFAULT NULL,
  `PostedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_categorydata`
--

INSERT INTO `mst_categorydata` (`CategoryID`, `CategoryName`, `CategoryNameURL`, `CategoryImage`, `CategoryBannerImage`, `SmallDescription`, `ActiveStatus`, `DisplayOnHeader`, `DisplayOnHome`, `DisplayOnSearchBy`, `DisplayOrder`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Multi Product', 'multi-product', 'multi-product-95.svg', 'multi-product-park-banner.png', 'A Multi Product Park is a modern hub for diverse industries.', 1, 1, 1, 1, 1, 'Multi Product Park | Indlay', '', '', '', '2025-09-20 10:43:16', 'Admin Panel', '2026-03-10 07:00:31'),
(4, 'Industrial Park', 'manufacturing ', 'manufacturing-.svg', 'export-promotion-industrial-park-banner.png', 'Integrated industrial ecosystem combining manufacturing with residential and commercial infrastructure.', 1, 1, 1, 1, 4, 'Export Promotion Industrial Park | Indlay', '', '', '', '2025-09-22 04:29:07', 'Admin Panel', '2026-03-07 07:54:53'),
(10, 'SEZ', 'sez', 'sez-41.svg', NULL, 'Export oriented industrial zone offering tax incentives and simplified trade regulations.', 1, 1, 1, 1, 7, 'SEZ | Indlay', '', '', '', '2025-11-05 10:47:38', 'Admin Panel', '2026-03-07 07:54:34'),
(11, 'EPZ', 'epz', 'epz-65.svg', NULL, 'Export Promotion Zone', 1, 1, 1, 1, 8, 'EPZ | Indlay', '', '', '', '2025-11-05 10:48:28', 'Admin Panel', '2026-03-10 07:01:03'),
(12, 'FTZ', 'ftz', 'ftz-25.svg', NULL, 'Free Trade Zone', 1, 1, 1, 1, 9, 'FTZ | Indlay', '', '', '', '2025-11-05 10:49:07', 'Admin Panel', '2026-03-10 07:01:02'),
(13, 'DTZ', 'dtz', 'dtz-13.svg', NULL, 'Domestic Tariff Zone', 1, 0, 0, 0, 10, 'DTZ | Indlay', '', '', '', '2025-11-05 10:49:28', 'Admin Panel', '2026-03-10 07:01:00'),
(14, 'Logistics Park', 'logistics-park', 'logistics-park-26.svg', NULL, 'Logistics Park', 1, 0, 0, 0, 11, 'Logistics Park | Indlay', '', '', '', '2025-11-05 10:51:41', 'Admin Panel', '2026-03-10 07:00:45'),
(15, 'IT Park', 'it-park', 'it-park-77.svg', NULL, 'Dedicated park for IT, ITES, software development and digital service companies.', 1, 1, 1, 1, 12, 'IT Park | Indlay', '', '', '', '2025-11-05 10:52:21', 'Admin Panel', '2026-03-07 07:54:22'),
(16, 'Pharma Park', 'pharmaceuticals-park', 'pharmaceuticals-park-65.svg', NULL, 'Cluster focused on pharmaceutical, biotech and medical device manufacturing', 1, 1, 1, 1, 13, 'Pharmaceuticals Park | Indlay', '', '', '', '2025-11-05 10:52:56', 'Admin Panel', '2026-03-07 07:54:13'),
(17, 'Electronics Park', 'electronic-manufacturing-cluster', 'electronic-manufacturing-cluster-75.svg', NULL, 'Specialized park for electronics manufacturing, assembly and component production.', 1, 1, 1, 1, 14, 'Electronic Manufacturing Cluster | Indlay', '', '', '', '2025-11-05 10:54:17', 'Admin Panel', '2026-03-07 07:54:03'),
(18, 'Port Based Industrial Park', 'port-based-industrial-park', 'port-based-industrial-park-88.svg', NULL, 'Port Based Industrial Park', 1, 1, 1, 1, 15, 'Port Based Industrial Park | Indlay', '', '', '', '2025-11-05 10:57:42', 'Admin Panel', '2026-03-10 07:00:54'),
(20, 'Multi Sector', 'multi-sector', 'multi-sector-52.png', NULL, 'Industrial park designed to accommodate multiple manufacturing and logistics industries.', 1, 0, 0, 0, 16, 'Multi Sector | Indlay', '', '', '', '2026-03-07 07:31:39', 'Admin Panel', '2026-03-10 07:00:57'),
(21, 'Textile Park', 'textile-park', 'textile-park-75.png', NULL, 'Industrial zone for textile manufacturing including spinning, weaving and garment production.', 1, 1, 0, 1, 17, 'Textile Park | Indlay', '', '', '', '2026-03-07 07:35:14', 'Admin Panel', '2026-03-16 13:00:43'),
(22, 'Engineering Park', 'engineering-park', 'engineering-park-20.png', NULL, 'Park designed for engineering industries, machinery, metal fabrication and industrial manufacturing.', 1, 1, 1, 1, 18, 'Engineering Park | Indlay', '', '', '', '2026-03-07 07:39:38', 'Admin Panel', '2026-03-07 07:54:41'),
(23, 'Food Processing Park', 'food-processing-park', 'food-processing-park-26.png', NULL, 'Cluster supporting agro processing, packaged food manufacturing and cold chain facilities', 1, 1, 1, 1, 19, 'Food Processing Park | Indlay', '', '', '', '2026-03-07 07:42:35', 'Admin Panel', '2026-03-07 07:52:25'),
(24, 'Chemical Park', 'chemical-park', 'chemical-park-33.png', NULL, 'Industrial zone designed for chemical processing and specialty chemical manufacturing.', 1, 1, 1, 1, 20, 'Chemical Park | Indlay', '', '', '', '2026-03-07 07:44:41', 'Admin Panel', '2026-03-07 07:52:14'),
(25, 'Automotive Park', 'automotive-park', 'automotive-park-15.png', NULL, 'Cluster supporting automobile manufacturing and auto component industries.', 1, 1, 1, 1, 21, 'Automotive Park | Indlay', '', '', '', '2026-03-07 07:46:38', 'Admin Panel', '2026-03-07 07:52:04');

-- --------------------------------------------------------

--
-- Table structure for table `mst_clientlogomapping`
--

CREATE TABLE `mst_clientlogomapping` (
  `MappingID` int(11) NOT NULL,
  `ClientTypeID` int(11) NOT NULL,
  `PartnerLogoID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mst_clienttype`
--

CREATE TABLE `mst_clienttype` (
  `ClientTypeID` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `ActiveStatus` tinyint(4) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_clienttype`
--

INSERT INTO `mst_clienttype` (`ClientTypeID`, `TypeName`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Cement Projects', 1, 1, '2026-05-13 16:44:22', 'Admin Panel', '2026-05-14 15:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `mst_collaborationdata`
--

CREATE TABLE `mst_collaborationdata` (
  `CollaborationID` int(11) NOT NULL,
  `CollaborationName` varchar(255) NOT NULL,
  `CollaborationNameURL` varchar(255) NOT NULL,
  `CollaborationImage` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mst_collaborationdata`
--

INSERT INTO `mst_collaborationdata` (`CollaborationID`, `CollaborationName`, `CollaborationNameURL`, `CollaborationImage`, `Description`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(2, '2010: Joint Venture with Christian Pfeiffer, Germany', '2010-joint-venture-with-christian-pfeiffer-germany', '2010-joint-venture-with-christian-pfeiffer-germany.webp', '<p>In 2010, we partnered with Christian Pfeiffer, Germany, establishing a joint venture company, Christian Pfeiffer India Pvt. Ltd. (CPI). CPI offers complete grinding solutions, catering to the needs of Ball Mills, Separators, and Diaphragms for the cement and mineral industries. The latest generation of Dynamic Classifiers and Flow Control Diaphragms, developed with advanced computer-simulated designs, ensures optimized performance for ball mills, making CPI a key player in the sector.</p>', 0, 1, '2026-04-25 11:22:04', 'Admin Panel', '2026-04-25 11:24:08'),
(3, '2017: Authorized Dealer for SIG (Italy) – Steel Belts for Bucket Elevators', '2017-authorized-dealer-for-sig-italy-steel-belts-for-bucket-elevators', '2017-authorized-dealer-for-sig-italy-steel-belts-for-bucket-elevators.webp', '<p>In 2017, Societa Italiana Gomma (SIG), Italy, appointed Chanderpur Group as its official dealer for European Steel Cord Belts used in Bucket Elevators and Pipe Conveyors in India and the Indian Subcontinent. This partnership allows us to offer high-quality, durable steel belts, ensuring superior performance and longevity in material handling systems. While the primary focus is on belt bucket elevators and pipe conveyors, our collaboration also extends to other key products that enhance industrial operations. This collaboration will leverage both companies\' expertise to set new benchmarks in belt manufacturing and material handling solutions.</p>', 1, 2, '2026-04-25 11:24:55', 'Admin Panel', '2026-05-05 18:48:52');

-- --------------------------------------------------------

--
-- Table structure for table `mst_companydata`
--

CREATE TABLE `mst_companydata` (
  `CompanyID` int(11) NOT NULL,
  `CompanyName` varchar(255) NOT NULL,
  `CompanyNameURL` varchar(255) NOT NULL,
  `CompanyImage` varchar(255) DEFAULT NULL,
  `CompanyBannerImage` varchar(255) DEFAULT NULL,
  `SmallDescription` text DEFAULT NULL,
  `Tagline` text DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` varchar(255) DEFAULT NULL,
  `MetaDescriptions` text DEFAULT NULL,
  `MetaSchema` text DEFAULT NULL,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mst_companydata`
--

INSERT INTO `mst_companydata` (`CompanyID`, `CompanyName`, `CompanyNameURL`, `CompanyImage`, `CompanyBannerImage`, `SmallDescription`, `Tagline`, `Description`, `ActiveStatus`, `DisplayOrder`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Chanderpur Works Pvt. Ltd.', 'chanderpur-works-pvt-ltd', 'chanderpur-works-pvt-ltd.webp', 'chanderpur-works-pvt-ltd-banner.webp', 'Since 1962, our flagship company has been a trusted leader in industrial engineering, manufacturing machinery for 	Cement Plants, Fertilizer Units, Mineral Processing, and Biomass-Based Power Solutions', 'Chanderpur Works Pvt. Ltd. has been a trusted name in engineering and machinery manufacturing since 1962.', '<p>We have a reputation for providing reliable solutions over the decades in industries like cement plants, fertilizer plants, mineral processing equipment and Gasifier Plants (Biomass Gasifier Plants &amp; MSW Gasifier Plants).</p><p>We collaborate closely with our clients to make their ideas a reality and provide them with a full EPC (Engineering, Procurement, and Construction) solution and tailored industrial equipment production according to the project demands.</p><p>We are dedicated to quality, and this has seen us gain recognition as a Star Export House by the Government of India, as well as ISO 9001 certification. About half of our business today is through global exports, and we are present in various continents. Our cement division has benefacted customers in Kenya, Sudan, Zambia, Nepal, Yemen, Djibouti, Bolivia, and Egypt, and our renewable energy products are commonly utilized in Europe and the United States.</p><p>Our superior in-house design, manufacturing, inspection and testing are what make us really special. We have a well-trained team of about 800 employees, and this has guaranteed accuracy and uniformity throughout the process. We continuously invest in cutting-edge software like Oracle ERP systems, SolidWorks, DriveWorks, AutoCAD, and STAAD to increase productivity and accuracy.</p><p>To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.</p><p>To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.</p>', 1, 2, 'Chanderpur Works Pvt. Ltd. | Chanderpur', '', '', '', '2026-04-25 11:42:31', 'Admin Panel', '2026-04-25 11:44:51');

-- --------------------------------------------------------

--
-- Table structure for table `mst_contact_us`
--

CREATE TABLE `mst_contact_us` (
  `ContactID` int(11) NOT NULL,
  `VendorID` int(11) NOT NULL,
  `FullName` varchar(500) DEFAULT NULL,
  `EmailID` varchar(500) DEFAULT NULL,
  `PhoneNo` varchar(50) DEFAULT NULL,
  `CompanyName` varchar(500) DEFAULT NULL,
  `Message` varchar(5000) DEFAULT NULL,
  `EnquiryType` varchar(500) DEFAULT NULL,
  `EnquiryFor` varchar(500) DEFAULT NULL,
  `CountryName` varchar(500) DEFAULT NULL,
  `PageName` varchar(500) DEFAULT NULL,
  `PostedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsRead` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_contact_us`
--

INSERT INTO `mst_contact_us` (`ContactID`, `VendorID`, `FullName`, `EmailID`, `PhoneNo`, `CompanyName`, `Message`, `EnquiryType`, `EnquiryFor`, `CountryName`, `PageName`, `PostedDate`, `IsRead`) VALUES
(71, 0, 'Vasudev Gidwani', 'kpvadd@gmail.com', '+91-9737890111', 'PCI', 'Let me know about your plot in detail ', 'Normal Enquiry', 'Normal Enquiry', 'India', '/gallops-industrial-park', '2026-03-21 09:27:21', 0),
(72, 0, 'Azeem Rza', 'developer@prettifycreative.com', '+91-7017637257', 'PCI', 'Testing Here', 'Normal Enquiry', 'Get Expert Advisory', 'India', '/', '2026-03-23 04:52:32', 0),
(73, 0, 'saurav v', 'saurav_v@hotmail.com', '+91-9811212388', 'PCI', 'Developing an Industrial Park in Uttar Pradesh. Need market survey for the area.', 'Service', 'Market Research & Location Strategy', 'India', '/market-research-location-strategy', '2026-04-01 11:58:25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mst_directordata`
--

CREATE TABLE `mst_directordata` (
  `DirectorID` int(11) NOT NULL,
  `DirectorName` varchar(150) NOT NULL,
  `DirectorDesignation` varchar(150) NOT NULL,
  `DirectorBio` text NOT NULL,
  `DirectorImage` varchar(255) DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT 'Admin',
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_directordata`
--

INSERT INTO `mst_directordata` (`DirectorID`, `DirectorName`, `DirectorDesignation`, `DirectorBio`, `DirectorImage`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Shri Sumesh Chandra  ', 'Founder', '<p>wrwrwrwrwrwr</p>', 'shri-sumesh-chandra.webp', 1, 1, '2026-04-25 11:26:08', 'Admin Panel', '2026-04-25 11:29:10'),
(2, 'Mr. Sunil Chandra', 'Managing Director', '', 'mr-sunil-chandra.webp', 1, 2, '2026-04-25 11:29:42', 'Admin Panel', '2026-04-25 11:29:42'),
(3, 'Mr. Sudhir Chandra', 'Managing Director', '', 'mr-sudhir-chandra.webp', 1, 3, '2026-04-25 11:30:08', 'Admin Panel', '2026-04-25 11:30:08');

-- --------------------------------------------------------

--
-- Table structure for table `mst_facilitycategory`
--

CREATE TABLE `mst_facilitycategory` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(255) DEFAULT NULL,
  `CategoryNameURL` varchar(255) DEFAULT NULL,
  `Tagline` varchar(255) DEFAULT NULL,
  `CategoryImage` varchar(255) DEFAULT NULL,
  `BannerImage` varchar(255) DEFAULT NULL,
  `SmallDescription` text DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `DisplayOrder` int(11) DEFAULT 0,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` text DEFAULT NULL,
  `MetaDescriptions` text DEFAULT NULL,
  `MetaSchema` text DEFAULT NULL,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_facilitycategory`
--

INSERT INTO `mst_facilitycategory` (`CategoryID`, `CategoryName`, `CategoryNameURL`, `Tagline`, `CategoryImage`, `BannerImage`, `SmallDescription`, `Description`, `DisplayOrder`, `ActiveStatus`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Machining Facilities', 'machining-facilities', 'High-precision machining for superior performance.', 'machining-facilities.png', 'machining-facilities-banner.png', 'We are well supported by well-laid Machining Facilities that are installed to meet the challenges and complex requirements of global markets. In our facility, we ensure to follow all the international trends in product development that support the overall growth of the company.', '', 1, 1, 'Machining Facilities | Chanderpur', '', '', '', '2026-05-13 15:36:26', 'Admin Panel', '2026-05-13 15:49:32'),
(2, 'Fabrication Facilities', 'fabrication-facilities', NULL, 'fabrication-facilities.png', NULL, '<p>We are fully facilitated with highly sophisticated and advanced Fabrication Facilities. Equipped with techniques like roll bending, CNC oxy cutting, CNC plasma cutting, shearing and edge bending, our fabrication unit has an excellent capacity of handling maximum production without any glitches.<br></p>', NULL, 2, 1, 'Fabrication Facilities | Chanderpur', '', '', '', '2026-05-13 15:38:04', 'Admin Panel', '2026-05-13 15:39:01');

-- --------------------------------------------------------

--
-- Table structure for table `mst_facilityproduct`
--

CREATE TABLE `mst_facilityproduct` (
  `ProductID` int(11) NOT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `ProductNameURL` varchar(255) DEFAULT NULL,
  `FacilityDefaultImage` varchar(255) DEFAULT NULL,
  `FacilityOtherImage1` varchar(255) DEFAULT NULL,
  `FacilityOtherImage2` varchar(255) DEFAULT NULL,
  `FacilityOtherImage3` varchar(255) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `DisplayOrder` int(11) DEFAULT 0,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_facilityproduct`
--

INSERT INTO `mst_facilityproduct` (`ProductID`, `CategoryID`, `ProductName`, `ProductNameURL`, `FacilityDefaultImage`, `FacilityOtherImage1`, `FacilityOtherImage2`, `FacilityOtherImage3`, `Description`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 1, 'CNC 5 - Axis Milling Machine (Make - Italy)', 'cnc-5---axis-milling-machine-make---italy', 'cnc-5---axis-milling-machine-make---italy.png', 'cnc-5---axis-milling-machine-make---italy_1.png', 'cnc-5---axis-milling-machine-make---italy_2.png', 'cnc-5---axis-milling-machine-make---italy_3.png', '<table> <tbody><tr> <th><div>Technical Details</div></th> <th><div>Sizes</div></th> </tr> <tr> <td><div>Control</div></td> <td><div>Heidenhain iTNC 530 HSC</div></td> </tr> <tr> <td><div>Travel X</div></td> <td><div>10.000 mm</div></td> </tr> <tr> <td><div>Travel Y</div></td> <td><div>4.000 mm</div></td> </tr> <tr> <td><div>Travel Z</div></td> <td><div>1750 mm</div></td> </tr> <tr> <td><div>Distance Between Columns</div></td> <td><div>5000 mm</div></td> </tr> <tr> <td><div>Spindle Speed</div></td> <td><div>up to 5000 rpm</div></td> </tr> <tr> <td><div>ATC</div></td> <td><div>180 Places</div></td> </tr></tbody></table>', 1, 1, '2026-05-13 15:42:01', 'Admin Panel', '2026-05-13 15:43:21');

-- --------------------------------------------------------

--
-- Table structure for table `mst_industrycategorydata`
--

CREATE TABLE `mst_industrycategorydata` (
  `IndustryCategoryID` int(11) NOT NULL,
  `IndustryCategoryName` varchar(255) NOT NULL,
  `IndustryCategoryNameURL` varchar(255) NOT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_industrycategorydata`
--

INSERT INTO `mst_industrycategorydata` (`IndustryCategoryID`, `IndustryCategoryName`, `IndustryCategoryNameURL`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Red', 'red', 1, '2025-11-11 13:48:09', 'Admin Panel', '2025-11-11 13:49:50'),
(2, '	Orange', 'orange', 1, '2025-11-11 15:13:46', 'Admin Panel', '2025-11-11 15:13:46'),
(3, 'Green', 'green', 1, '2025-11-11 15:13:54', 'Admin Panel', '2025-11-11 15:13:54'),
(4, 'White ', 'white', 1, '2025-11-11 15:14:03', 'Admin Panel', '2025-11-12 12:21:53'),
(5, 'Blue', 'blue', 1, '2026-03-25 10:27:37', 'Admin Panel', '2026-03-25 10:27:37');

-- --------------------------------------------------------

--
-- Table structure for table `mst_manufacturing`
--

CREATE TABLE `mst_manufacturing` (
  `ManufacturingID` int(11) NOT NULL,
  `ManufacturingName` varchar(255) NOT NULL,
  `ManufacturingNameURL` varchar(255) NOT NULL,
  `ManufacturingVideoUrl` varchar(500) DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_manufacturing`
--

INSERT INTO `mst_manufacturing` (`ManufacturingID`, `ManufacturingName`, `ManufacturingNameURL`, `ManufacturingVideoUrl`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(3, 'In House Manufacturing Excellence', 'in-house-manufacturing-excellence', 'in-house-manufacturing-excellence.mp4', 1, 1, '2026-05-12 15:50:52', 'Admin Panel', '2026-05-12 15:50:52');

-- --------------------------------------------------------

--
-- Table structure for table `mst_ourmilestonedata`
--

CREATE TABLE `mst_ourmilestonedata` (
  `MilestoneID` int(11) NOT NULL,
  `MilestoneName` varchar(255) NOT NULL,
  `MilestoneNameURL` varchar(255) NOT NULL,
  `MilestoneImage` varchar(255) DEFAULT NULL,
  `MilestoneYear` varchar(10) NOT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT 'Admin Panel',
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_ourmilestonedata`
--

INSERT INTO `mst_ourmilestonedata` (`MilestoneID`, `MilestoneName`, `MilestoneNameURL`, `MilestoneImage`, `MilestoneYear`, `Description`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Since 1962', 'since-1962', 'since-1962.webp', '1962', '<p>Chanderpur Group was established, and its first company, Chanderpur Works Pvt. Ltd commenced with supplying sugar machinery to the sugar industry.</p>', 1, 1, '2026-04-25 11:48:26', 'Admin Panel', '2026-05-05 18:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `mst_partnerlogodata`
--

CREATE TABLE `mst_partnerlogodata` (
  `PartnerLogoID` int(11) NOT NULL,
  `PartnerLogoImage` varchar(255) DEFAULT NULL,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `DisplayOnHome` tinyint(1) DEFAULT NULL,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT '',
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mst_partnerlogodata`
--

INSERT INTO `mst_partnerlogodata` (`PartnerLogoID`, `PartnerLogoImage`, `ActiveStatus`, `DisplayOnHome`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, '1778750746882.png', 1, 0, 1, '2026-04-25 12:29:43', 'Admin Panel', '2026-05-14 14:55:46'),
(2, '1778750739451.png', 1, 1, 2, '2026-05-14 14:55:39', 'Admin Panel', '2026-05-14 14:55:39'),
(3, '1778750755100.png', 1, 1, 3, '2026-05-14 14:55:55', 'Admin Panel', '2026-05-14 14:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `mst_staticdata`
--

CREATE TABLE `mst_staticdata` (
  `StaticID` int(11) NOT NULL,
  `StaticName` varchar(255) NOT NULL,
  `StaticNameURL` varchar(255) NOT NULL,
  `StaticImage` varchar(255) DEFAULT NULL,
  `StaticBannerVideo` varchar(255) DEFAULT NULL,
  `SmallDescription` varchar(5000) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `StaticAddress` text DEFAULT NULL,
  `StaticAddress2` text DEFAULT NULL,
  `StaticPhoneNumber2` varchar(50) DEFAULT NULL,
  `StaticPhoneNumber` varchar(50) DEFAULT NULL,
  `StaticEmail` varchar(255) DEFAULT NULL,
  `StaticTwitterLink` text DEFAULT NULL,
  `StaticFacebookLink` text DEFAULT NULL,
  `StaticInstagramLink` text DEFAULT NULL,
  `StaticLinkedInLink` text DEFAULT NULL,
  `StaticYouTubeLink` text DEFAULT NULL,
  `StaticWhatsAppLink` text DEFAULT NULL,
  `StaticPinterestLink` text DEFAULT NULL,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` varchar(2000) DEFAULT NULL,
  `MetaDescriptions` varchar(2000) DEFAULT NULL,
  `MetaSchema` varchar(5000) DEFAULT NULL,
  `PostedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_staticdata`
--

INSERT INTO `mst_staticdata` (`StaticID`, `StaticName`, `StaticNameURL`, `StaticImage`, `StaticBannerVideo`, `SmallDescription`, `Description`, `ActiveStatus`, `StaticAddress`, `StaticAddress2`, `StaticPhoneNumber2`, `StaticPhoneNumber`, `StaticEmail`, `StaticTwitterLink`, `StaticFacebookLink`, `StaticInstagramLink`, `StaticLinkedInLink`, `StaticYouTubeLink`, `StaticWhatsAppLink`, `StaticPinterestLink`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Home', 'home', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Home | Chanderpur', '', '', '', '2026-04-24 07:56:22', 'Admin Panel', '2026-04-24 07:56:22'),
(2, 'Products', 'products', NULL, 'products-banner.mp4', 'Increasing in numbers gradually with exponentially increasing feature.', '<p>We provide turnkey plant solutions as well as an extensive line of industrial machinery and process equipment such as Continuous Ball Mills, Rotary Kilns, Material Handling Systems and other mineral processing equipment. We produce our goods according to the international standards of industry, with modern engineering technology, with accuracy of fabrication and the best raw materials. We also offer tailored engineering solutions based on client specifications to achieve efficient operations, reliability, and high performance.</p>', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Products | Chanderpur', '', '', '', '2026-04-24 09:22:17', 'Admin Panel', '2026-04-24 09:23:38');

-- --------------------------------------------------------

--
-- Table structure for table `mst_testimonialdata`
--

CREATE TABLE `mst_testimonialdata` (
  `TestimonialID` int(11) NOT NULL,
  `TestimonialName` varchar(500) NOT NULL,
  `TestimonialNameURL` varchar(500) NOT NULL,
  `TestimonialImage` varchar(500) DEFAULT NULL,
  `TestimonialDescription` varchar(5000) DEFAULT NULL,
  `DisplayOnHome` int(1) DEFAULT NULL,
  `DisplayOrder` int(11) NOT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `PostedDate` datetime NOT NULL,
  `UpdatedBy` varchar(500) DEFAULT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_testimonialdata`
--

INSERT INTO `mst_testimonialdata` (`TestimonialID`, `TestimonialName`, `TestimonialNameURL`, `TestimonialImage`, `TestimonialDescription`, `DisplayOnHome`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Sulux Phosphate Ltd.', 'sulux-phosphate-ltd', 'sulux-phosphate-ltd.svg', '<p>​<span style=\"color: rgb(33, 26, 29);font-size: 12px;background-color: rgb(255, 251, 255)\">We are having 3 Nos. of 300 TPD Ball Mills supplied by Chanderpur Works Pvt. Ltd., Yamunanagar at our plant in Birgunj. The mills are performing satisfactorily.</span>​<br></p>', 1, 1, 1, '2026-04-25 11:11:10', 'Admin Panel', '2026-04-25 11:11:10'),
(2, 'TATA Power', 'tata-power', 'tata-power.svg', '<p>​<span style=\"color: rgb(33, 26, 29);font-size: 12px;background-color: rgb(255, 251, 255)\">14 KW Biomass project at Trombay colony TATA Power has successfully commissioned. Thanks for your co-operation and support. Your representative has done great job and because of him project completed in schedule time. We required your help for synchronizing scheme for same project.</span>​<br></p>', 1, 2, 1, '2026-04-25 11:11:46', 'Admin Panel', '2026-04-25 11:11:46');

-- --------------------------------------------------------

--
-- Table structure for table `mst_userdata`
--

CREATE TABLE `mst_userdata` (
  `loginID` int(11) NOT NULL,
  `Role` varchar(500) DEFAULT NULL,
  `FullName` varchar(500) DEFAULT NULL,
  `EmailID` varchar(500) DEFAULT NULL,
  `PhoneNumber` varchar(500) DEFAULT NULL,
  `ProfileImage` varchar(500) DEFAULT NULL,
  `UserName` varchar(255) NOT NULL,
  `Passwords` varchar(255) NOT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `RegisterDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `LastLoginDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_userdata`
--

INSERT INTO `mst_userdata` (`loginID`, `Role`, `FullName`, `EmailID`, `PhoneNumber`, `ProfileImage`, `UserName`, `Passwords`, `ActiveStatus`, `RegisterDate`, `LastLoginDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Super Admin', 'Chanderpur Admin', 'chanderpur@gmail.com', '9999999999', '', 'chanderpur.Admin', 'chanderpur@Admin', 1, '2026-04-24 06:59:35', '2026-04-24 06:59:35', '', '2026-04-24 06:59:35'),
(2, 'Admin', 'Pawan Paliwal', 'paliwal@gmail.com', '9878745874', NULL, 'Pawan.Paliwal.afford', 'PawanPaliwal@Admin', 1, '2026-04-24 08:03:42', '2026-04-24 08:03:42', 'admin', '2026-04-25 08:02:25');

-- --------------------------------------------------------

--
-- Table structure for table `mst_userpagespermissions`
--

CREATE TABLE `mst_userpagespermissions` (
  `PermissionID` int(11) NOT NULL,
  `LoginID` int(11) NOT NULL,
  `PageID` int(11) NOT NULL,
  `CanRead` tinyint(1) DEFAULT 0,
  `CanWrite` tinyint(1) DEFAULT 0,
  `CanDelete` tinyint(1) DEFAULT 0,
  `CanAdd` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mst_webgallerydatab`
--

CREATE TABLE `mst_webgallerydatab` (
  `galleryID` int(11) NOT NULL,
  `galleryType` varchar(50) NOT NULL,
  `galleryTitle` varchar(255) NOT NULL,
  `galleryImage` varchar(255) DEFAULT NULL,
  `galleryVideoURL` varchar(255) DEFAULT NULL,
  `activeStatus` tinyint(4) DEFAULT 1,
  `postedDate` datetime DEFAULT current_timestamp(),
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_webgallerydatab`
--

INSERT INTO `mst_webgallerydatab` (`galleryID`, `galleryType`, `galleryTitle`, `galleryImage`, `galleryVideoURL`, `activeStatus`, `postedDate`, `updatedBy`, `updatedOn`) VALUES
(5, 'Image', 'Products', 'products-cover.png', '', 1, '2026-05-12 16:38:17', 'Admin', '2026-05-12 16:38:17'),
(6, 'Video', 'Projects Executed', 'projects-executed-cover.png', 'https://www.youtube.com/embed/XucJoMOkrvQ?si=T9qHKrZ0T5aWUCnP', 1, '2026-05-12 16:39:18', 'Admin', '2026-05-12 16:39:18');

-- --------------------------------------------------------

--
-- Table structure for table `mst_webgalleryphotos`
--

CREATE TABLE `mst_webgalleryphotos` (
  `photoID` int(11) NOT NULL,
  `galleryID` int(11) NOT NULL,
  `photoImage` varchar(255) NOT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mst_whatsnewdata`
--

CREATE TABLE `mst_whatsnewdata` (
  `WhatsNewID` int(11) NOT NULL,
  `WhatsNewName` varchar(255) DEFAULT NULL,
  `WhatsNewNameURL` varchar(255) DEFAULT NULL,
  `WhatsNewImage` varchar(255) DEFAULT NULL,
  `Tagline` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `DisplayOrder` int(11) DEFAULT 0,
  `ActiveStatus` tinyint(1) DEFAULT 1,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_whatsnewdata`
--

INSERT INTO `mst_whatsnewdata` (`WhatsNewID`, `WhatsNewName`, `WhatsNewNameURL`, `WhatsNewImage`, `Tagline`, `Description`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'We are thrilled to share an exciting acheivement', 'we-are-thrilled-to-share-an-exciting-acheivement', 'we-are-thrilled-to-share-an-exciting-acheivement.png', 'SiliconIndia Features Chanderpur Group Among \'10 Most Promising Waste-to-Energy Providers 2024', '<p>We are thrilled to share an exciting acheivement</p><p>Our group company,&nbsp;Chanderpur Renewable Power Company Pvt. Ltd., has been honoured with the&nbsp;\"Recognition of In-House R&amp;D Unit\"&nbsp;by the&nbsp;Department of Scientific and Industrial Research (DSIR), Government of India.<br><br>This prestigious recognition is a testament to our continuous commitment to innovation, excellence in research and development, and our contribution to sustainable energy solutions.<br></p>', 1, 1, '2026-05-13 15:15:11', 'Admin Panel', '2026-05-13 15:16:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mst_awarddata`
--
ALTER TABLE `mst_awarddata`
  ADD PRIMARY KEY (`AwardLogoID`);

--
-- Indexes for table `mst_blogdata`
--
ALTER TABLE `mst_blogdata`
  ADD PRIMARY KEY (`BlogID`);

--
-- Indexes for table `mst_careerdata`
--
ALTER TABLE `mst_careerdata`
  ADD PRIMARY KEY (`CareerID`);

--
-- Indexes for table `mst_clientlogomapping`
--
ALTER TABLE `mst_clientlogomapping`
  ADD PRIMARY KEY (`MappingID`),
  ADD KEY `ClientTypeID` (`ClientTypeID`),
  ADD KEY `PartnerLogoID` (`PartnerLogoID`);

--
-- Indexes for table `mst_clienttype`
--
ALTER TABLE `mst_clienttype`
  ADD PRIMARY KEY (`ClientTypeID`);

--
-- Indexes for table `mst_collaborationdata`
--
ALTER TABLE `mst_collaborationdata`
  ADD PRIMARY KEY (`CollaborationID`),
  ADD UNIQUE KEY `ServiceName_UQ` (`CollaborationName`),
  ADD UNIQUE KEY `ServiceNameURL_UQ` (`CollaborationNameURL`);

--
-- Indexes for table `mst_companydata`
--
ALTER TABLE `mst_companydata`
  ADD PRIMARY KEY (`CompanyID`),
  ADD UNIQUE KEY `ServiceName_UQ` (`CompanyName`),
  ADD UNIQUE KEY `ServiceNameURL_UQ` (`CompanyNameURL`);

--
-- Indexes for table `mst_directordata`
--
ALTER TABLE `mst_directordata`
  ADD PRIMARY KEY (`DirectorID`);

--
-- Indexes for table `mst_facilitycategory`
--
ALTER TABLE `mst_facilitycategory`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `mst_facilityproduct`
--
ALTER TABLE `mst_facilityproduct`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `fk_category` (`CategoryID`);

--
-- Indexes for table `mst_manufacturing`
--
ALTER TABLE `mst_manufacturing`
  ADD PRIMARY KEY (`ManufacturingID`);

--
-- Indexes for table `mst_ourmilestonedata`
--
ALTER TABLE `mst_ourmilestonedata`
  ADD PRIMARY KEY (`MilestoneID`);

--
-- Indexes for table `mst_partnerlogodata`
--
ALTER TABLE `mst_partnerlogodata`
  ADD PRIMARY KEY (`PartnerLogoID`);

--
-- Indexes for table `mst_staticdata`
--
ALTER TABLE `mst_staticdata`
  ADD PRIMARY KEY (`StaticID`);

--
-- Indexes for table `mst_testimonialdata`
--
ALTER TABLE `mst_testimonialdata`
  ADD PRIMARY KEY (`TestimonialID`);

--
-- Indexes for table `mst_userdata`
--
ALTER TABLE `mst_userdata`
  ADD PRIMARY KEY (`loginID`);

--
-- Indexes for table `mst_userpagespermissions`
--
ALTER TABLE `mst_userpagespermissions`
  ADD PRIMARY KEY (`PermissionID`);

--
-- Indexes for table `mst_webgallerydatab`
--
ALTER TABLE `mst_webgallerydatab`
  ADD PRIMARY KEY (`galleryID`);

--
-- Indexes for table `mst_webgalleryphotos`
--
ALTER TABLE `mst_webgalleryphotos`
  ADD PRIMARY KEY (`photoID`),
  ADD KEY `fk_gallery` (`galleryID`);

--
-- Indexes for table `mst_whatsnewdata`
--
ALTER TABLE `mst_whatsnewdata`
  ADD PRIMARY KEY (`WhatsNewID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mst_awarddata`
--
ALTER TABLE `mst_awarddata`
  MODIFY `AwardLogoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_blogdata`
--
ALTER TABLE `mst_blogdata`
  MODIFY `BlogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_careerdata`
--
ALTER TABLE `mst_careerdata`
  MODIFY `CareerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_clientlogomapping`
--
ALTER TABLE `mst_clientlogomapping`
  MODIFY `MappingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mst_clienttype`
--
ALTER TABLE `mst_clienttype`
  MODIFY `ClientTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_collaborationdata`
--
ALTER TABLE `mst_collaborationdata`
  MODIFY `CollaborationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_companydata`
--
ALTER TABLE `mst_companydata`
  MODIFY `CompanyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_directordata`
--
ALTER TABLE `mst_directordata`
  MODIFY `DirectorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_facilitycategory`
--
ALTER TABLE `mst_facilitycategory`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_facilityproduct`
--
ALTER TABLE `mst_facilityproduct`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_manufacturing`
--
ALTER TABLE `mst_manufacturing`
  MODIFY `ManufacturingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_ourmilestonedata`
--
ALTER TABLE `mst_ourmilestonedata`
  MODIFY `MilestoneID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_partnerlogodata`
--
ALTER TABLE `mst_partnerlogodata`
  MODIFY `PartnerLogoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_staticdata`
--
ALTER TABLE `mst_staticdata`
  MODIFY `StaticID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_testimonialdata`
--
ALTER TABLE `mst_testimonialdata`
  MODIFY `TestimonialID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_userdata`
--
ALTER TABLE `mst_userdata`
  MODIFY `loginID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_userpagespermissions`
--
ALTER TABLE `mst_userpagespermissions`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `mst_webgallerydatab`
--
ALTER TABLE `mst_webgallerydatab`
  MODIFY `galleryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mst_webgalleryphotos`
--
ALTER TABLE `mst_webgalleryphotos`
  MODIFY `photoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mst_whatsnewdata`
--
ALTER TABLE `mst_whatsnewdata`
  MODIFY `WhatsNewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mst_clientlogomapping`
--
ALTER TABLE `mst_clientlogomapping`
  ADD CONSTRAINT `mst_clientlogomapping_ibfk_1` FOREIGN KEY (`ClientTypeID`) REFERENCES `mst_clienttype` (`ClientTypeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `mst_clientlogomapping_ibfk_2` FOREIGN KEY (`PartnerLogoID`) REFERENCES `mst_partnerlogodata` (`PartnerLogoID`) ON DELETE CASCADE;

--
-- Constraints for table `mst_facilityproduct`
--
ALTER TABLE `mst_facilityproduct`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`CategoryID`) REFERENCES `mst_facilitycategory` (`CategoryID`) ON DELETE SET NULL;

--
-- Constraints for table `mst_webgalleryphotos`
--
ALTER TABLE `mst_webgalleryphotos`
  ADD CONSTRAINT `fk_gallery` FOREIGN KEY (`galleryID`) REFERENCES `mst_webgallerydatab` (`galleryID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
