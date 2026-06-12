-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2026 at 08:22 AM
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
(3, 'award-logo-1780747096058-809765.webp', 1, 1, '2026-04-25 10:40:32', 'Admin Panel', '2026-06-06 17:28:16'),
(4, 'award-logo-1780747102425-583721.png', 1, 2, '2026-06-06 17:28:22', 'Admin Panel', '2026-06-06 17:28:25'),
(5, 'award-logo-1780747114802-94146.webp', 1, 3, '2026-06-06 17:28:34', 'Admin Panel', '2026-06-06 17:28:34'),
(6, 'award-logo-1780894446039-350792.webp', 1, 4, '2026-06-08 10:24:06', 'Admin Panel', '2026-06-08 10:25:19'),
(7, 'award-logo-1780894458998-610403.webp', 1, 5, '2026-06-08 10:24:12', 'Admin Panel', '2026-06-08 10:25:17');

-- --------------------------------------------------------

--
-- Table structure for table `mst_blogdata`
--

CREATE TABLE `mst_blogdata` (
  `BlogID` int(11) NOT NULL,
  `BlogName` varchar(255) NOT NULL,
  `BlogNameURL` varchar(255) NOT NULL,
  `BlogImage` varchar(255) NOT NULL,
  `BlogBannerImage` varchar(1000) NOT NULL,
  `Description` text DEFAULT NULL,
  `ActiveStatus` int(11) NOT NULL,
  `RecentActiveStatus` int(11) DEFAULT NULL,
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

INSERT INTO `mst_blogdata` (`BlogID`, `BlogName`, `BlogNameURL`, `BlogImage`, `BlogBannerImage`, `Description`, `ActiveStatus`, `RecentActiveStatus`, `DisplayOrder`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'The Future of Manufacturing: Trends Shaping the Next Decade', 'the-future-of-manufacturing-trends-shaping-the-next-decade', 'the-future-of-manufacturing-trends-shaping-the-next-decade.svg', 'the-future-of-manufacturing-trends-shaping-the-next-decade-banner.svg', '<p>Lorem ipsum dolor sit amet consectetur. Maecenas vel fringilla felis faucibus arcu in ultrices quam aliquam. Sed faucibus libero at tincidunt amet sed rhoncus. Pulvinar vitae viverra interdum orci mauris facilisis libero aenean amet. Viverra eu feugiat eu placerat dui auctor. Est gravida sit euismod aenean. At sit risus auctor nisi. Mi ornare faucibus at enim sed egestas. Mauris pretium enim proin nam fames. Est risus ut amet a tincidunt tincidunt ut ultricies. Velit arcu at at nullam leo sodales egestas aenean sed. Placerat sit elit aliquam lectus quis odio mattis enim. Laoreet habitant felis praesent in augue sagittis. Non in ut at elementum viverra quam duis non metus.Et egestas facilisis libero orci sed mauris massa erat. Egestas fusce bibendum dolor condimentum neque. Feugiat commodo ut erat ipsum faucibus lacus libero. Ullamcorper a odio mi volutpat id ut urna. Nulla facilisi tristique lorem tellus lectus a. Condimentum tempus leo eu at vitae purus est cras eget. Vel varius orci tempus aliquam.</p><div class=\"se-component se-image-container __se__float-none\"><figure><img alt=\"\" src=\"/image/insight/image.svg\" data-proportion=\"true\" data-align=\"none\" data-file-name=\"image.svg\" data-file-size=\"0\" data-origin=\",\" data-size=\",\" data-rotate=\"\" data-percentage=\"auto,auto\" style=\"\"></figure></div><h3>Lorem ipsum dolor sit amet consectetur. </h3><p>Lorem ipsum dolor sit amet consectetur. Maecenas vel fringilla felis faucibus arcu in ultrices quam aliquam. Sed faucibus libero at tincidunt amet sed rhoncus. Pulvinar vitae viverra interdum orci mauris facilisis libero aenean amet. Viverra eu feugiat eu placerat dui auctor. Est gravida sit euismod aenean. At sit risus auctor nisi. Mi ornare faucibus at enim sed egestas. Mauris pretium enim proin nam fames. Est risus ut amet a tincidunt tincidunt ut ultricies. Velit arcu at at nullam leo sodales egestas aenean sed. Placerat sit elit aliquam lectus quis odio mattis enim. Laoreet habitant felis praesent in augue sagittis. Non in ut at elementum viverra quam duis non metus.Et egestas facilisis libero orci sed mauris massa erat. Egestas fusce bibendum dolor condimentum neque. Feugiat commodo ut erat ipsum faucibus lacus libero. Ullamcorper a odio mi volutpat id ut urna. Nulla facilisi tristique lorem tellus lectus a. Condimentum tempus leo eu at vitae purus est cras eget. Vel varius orci tempus aliquam.</p>', 1, NULL, 2, 'The Future of Manufacturing: Trends Shaping the Next Decade | Chanderpur', '', '', '', '2026-04-25 06:24:11', 'Admin Panel', '2026-06-06 12:50:00'),
(2, 'How Automation is Transforming Modern Manufacturing', 'how-automation-is-transforming-modern-manufacturing', 'how-automation-is-transforming-modern-manufacturing.svg', 'how-automation-is-transforming-modern-manufacturing-banner.svg', '<p>Automation is revolutionizing the manufacturing industry by enhancing productivity, improving quality, and reducing operational costs. As businesses strive to meet increasing customer demands and remain competitive in a global marketplace, automated technologies have become a critical component of modern manufacturing processes.One of the most significant benefits of automation is increased efficiency. Automated machines and robotic systems can operate continuously with minimal downtime, allowing manufacturers to produce goods faster and more consistently than traditional manual methods. This increased production capacity helps companies meet tight deadlines and scale operations effectively.Quality control has also improved dramatically through automation. Advanced sensors, machine vision systems, and artificial intelligence can detect defects with greater accuracy than human inspection alone. By identifying issues early in the production process, manufacturers can reduce waste, minimize rework, and ensure that products meet strict quality standards.</p><p>Workplace safety is another area where automation delivers substantial benefits. Robots and automated equipment can perform repetitive, hazardous, or physically demanding tasks, reducing the risk of workplace injuries. This allows employees to focus on higher-value activities such as process optimization, equipment maintenance, and strategic decision-making.Data-driven manufacturing is becoming increasingly common through the integration of automation technologies. Smart machines collect real-time data on production performance, equipment health, and resource utilization. Manufacturers can analyze this information to improve efficiency, predict maintenance requirements, and make informed business decisions.</p>', 1, 1, 1, 'How Automation is Transforming Modern Manufacturing | Chanderpur', '', '', '', '2026-06-06 11:11:39', 'Admin Panel', '2026-06-08 06:27:35');

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
(1, 'Oracle EBS Techno-functional / Information Technology (IT)', '<h1>Full Stack Developer</h1><p><strong>Company:</strong> ABC Technologies</p><p><strong>Location:</strong> New Delhi, India</p><p><strong>Experience:</strong> 2+ Years</p><p><strong>Job Type:</strong> Full-Time</p><p>        We are looking for a skilled and passionate Full Stack Developer to join our growing development team.        The ideal candidate should have experience in frontend and backend development and be able to build        scalable web applications.    </p><h2>Key Responsibilities</h2><h2>Required Skills</h2><h2>Qualifications</h2><h2>Benefits</h2><p>        Interested candidates can apply by sending their updated resume to        <strong>careers@abctech.com</strong>.    </p><div> <ul><li>Develop and maintain web applications using modern technologies.</li><li>Build responsive and user-friendly frontend interfaces.</li><li>Create and manage backend APIs and database systems.</li><li>Collaborate with designers, developers, and project managers.</li><li>Debug, optimize, and improve application performance.</li></ul> <ul><li>Strong knowledge of HTML, CSS, JavaScript, and React.js.</li><li>Experience with Node.js and Express.js.</li><li>Knowledge of MongoDB or MySQL databases.</li><li>Understanding of REST APIs and Git version control.</li><li>Good problem-solving and communication skills.</li></ul> <ul><li>Bachelor’s degree in Computer Science or related field.</li><li>Minimum 2 years of relevant experience.</li></ul> <ul><li>Competitive salary package.</li><li>Flexible work environment.</li><li>Career growth opportunities.</li><li>Health and paid leave benefits.</li></ul> </div>', 'Yamunanagar Haryana and Noida Uttar Pradesh', 'Full time (Work from office)', 1, 1, '2026-05-12 11:46:51', 'Admin Panel', '2026-06-08 12:32:23');

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

--
-- Dumping data for table `mst_clientlogomapping`
--

INSERT INTO `mst_clientlogomapping` (`MappingID`, `ClientTypeID`, `PartnerLogoID`) VALUES
(6, 1, 3),
(7, 1, 1),
(8, 1, 4),
(9, 1, 5),
(16, 2, 1),
(17, 2, 2),
(18, 2, 6),
(19, 2, 7),
(20, 2, 8),
(21, 2, 9),
(22, 2, 5),
(23, 2, 4),
(24, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `mst_clienttype`
--

CREATE TABLE `mst_clienttype` (
  `ClientTypeID` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `TypeNameURL` varchar(255) DEFAULT NULL,
  `SmallDescription` text DEFAULT NULL,
  `Heading` varchar(255) DEFAULT NULL,
  `ListHeading` varchar(255) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `ListDescription` longtext DEFAULT NULL,
  `ProductDescription` longtext DEFAULT NULL,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` varchar(500) DEFAULT NULL,
  `MetaDescriptions` varchar(500) DEFAULT NULL,
  `MetaSchema` text DEFAULT NULL,
  `BannerImage` varchar(255) DEFAULT NULL,
  `Image1` varchar(255) DEFAULT NULL,
  `Image2` varchar(255) DEFAULT NULL,
  `Image3` varchar(255) DEFAULT NULL,
  `ActiveStatus` tinyint(4) DEFAULT 1,
  `DisplayOrder` int(11) DEFAULT 0,
  `PostedDate` datetime DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_clienttype`
--

INSERT INTO `mst_clienttype` (`ClientTypeID`, `TypeName`, `TypeNameURL`, `SmallDescription`, `Heading`, `ListHeading`, `Description`, `ListDescription`, `ProductDescription`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `BannerImage`, `Image1`, `Image2`, `Image3`, `ActiveStatus`, `DisplayOrder`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Cement Projects', 'cement-projects', '60+ Years of Excellence in Cement Engineering - Delivering Total Plant Solutions Globally.', 'Overview', 'Successful Installations', '<p>Cement manufacturing as a process and as a core industry has undergone many stages of transformation in recent years. CPG holds deep domain knowledge of the industry and hence, is equipped to offer customized services that are directed to meet the needs of clients from cement plants. CPG delivers reliable cement project execution for cement plants using advanced cement machinery. With the manufacturing of individual components of cement plants and with fabrication, installation &amp; commissioning of entire cement plants, the Cement Division of CPG has supplied &amp; commissioned more than 300 Cement Plants. We execute turnkey cement projects for Cement Plants, Rotary Kiln Cement Plants, Vertical Shaft Cement Plants, Clinker Grinding Units, Slag Cement Grinding Units and Slag Grinding Projects.</p>', '<ul><li>Rotary Kiln Cement Plant</li><li>VSK Cement Plant</li><li>Cement Grinding Plant</li><li>Cement Plant Equipment</li><li>Projects Executed</li></ul>', '<p>For successful implementation of our turnkey cement projects, we conduct various types of project development studies, feasibility studies, cement project consultants etc. These are followed by engineering, procurement &amp; construction management (EPCM) services. We supervise the construction and commissioning along with offering start-up and post-start-up services. We have also upgraded existing cement plants for better productivity and energy savings and have already supplied various cement projects in India, Latin America, Africa and other countries in Asia. Our pool of highly qualified and experienced teams of technical designers and consultants work in tandem with client\'s requirements to achieve the best possible plant design. Plant design and fabrication/construction are made to suit the conditions where the plant is to be installed.</p>', 'Cement Projects | Chanderpur Group', '', '', '', 'cement-projects-banner.webp', 'cement-projects_1.webp', 'cement-projects_2.webp', 'cement-projects_3.webp', 1, 1, '2026-05-13 16:44:22', 'Admin Panel', '2026-06-12 11:36:36'),
(2, 'Flue Gas Desulfurization Plants', 'flue-gas-desulfurization-plants', 'Flue Gas Desulfurization (FGD) Plants remove SO₂ emissions from flue gases.', 'Overview', 'Flue Gas Desulfurization (FGD) Plant', '<p>Flue Gas Desulfurization (FGD) Plants are advanced air pollution control systems engineered to remove sulfur dioxide (SO₂) and other harmful pollutants from industrial flue gases before they are released into the atmosphere. Widely used in thermal power plants, cement plants, refineries, and various industrial facilities, these systems play a vital role in reducing air pollution and minimizing the environmental impact of industrial operations.FGD plants help industries comply with stringent environmental regulations by significantly lowering SO₂ emissions, which are a major contributor to acid rain, respiratory problems, and environmental degradation. Using proven desulfurization technologies, these systems ensure efficient pollutant removal while supporting sustainable and environmentally responsible operations. Their reliable performance, operational efficiency, and contribution to cleaner air make FGD plants an essential component of modern emission control strategies.</p>', '<p>Reliable grinding solution for flue gas desulfurization project</p>', '<p>IT Products provide innovative technology solutions designed to enhance business efficiency, productivity, and digital transformation. From software applications and enterprise systems to cloud-based platforms and IT infrastructure solutions, these products help organizations streamline operations, improve collaboration, strengthen security, and support scalable growth in a rapidly evolving digital landscape.</p>', NULL, NULL, NULL, NULL, 'flue-gas-desulfurization-plants-banner.webp', 'flue-gas-desulfurization-plants_1.webp', 'flue-gas-desulfurization-plants_2.webp', 'flue-gas-desulfurization-plants_3.webp', 1, 2, '2026-06-06 17:27:09', 'Admin Panel', '2026-06-11 16:31:53');

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
(2, '2010: Joint Venture with Christian Pfeiffer, Germany', '2010-joint-venture-with-christian-pfeiffer-germany', '2010-joint-venture-with-christian-pfeiffer-germany.webp', '<p>In 2010, we partnered with Christian Pfeiffer, Germany, establishing a joint venture company, Christian Pfeiffer India Pvt. Ltd. (CPI). CPI offers complete grinding solutions, catering to the needs of Ball Mills, Separators, and Diaphragms for the cement and mineral industries. The latest generation of Dynamic Classifiers and Flow Control Diaphragms, developed with advanced computer-simulated designs, ensures optimized performance for ball mills, making CPI a key player in the sector.</p>', 1, 1, '2026-04-25 11:22:04', 'Admin Panel', '2026-06-08 10:16:48'),
(3, '2017: Authorized Dealer for SIG (Italy) – Steel Belts for Bucket Elevators', '2017-authorized-dealer-for-sig-italy-steel-belts-for-bucket-elevators', '2017-authorized-dealer-for-sig-italy-steel-belts-for-bucket-elevators.webp', '<p>In 2017, Societa Italiana Gomma (SIG), Italy, appointed Chanderpur Group as its official dealer for European Steel Cord Belts used in Bucket Elevators and Pipe Conveyors in India and the Indian Subcontinent. This partnership allows us to offer high-quality, durable steel belts, ensuring superior performance and longevity in material handling systems. While the primary focus is on belt bucket elevators and pipe conveyors, our collaboration also extends to other key products that enhance industrial operations. This collaboration will leverage both companies\' expertise to set new benchmarks in belt manufacturing and material handling solutions.</p>', 1, 2, '2026-04-25 11:24:55', 'Admin Panel', '2026-06-08 10:16:45');

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
(1, 'Chanderpur Works Pvt. Ltd.', 'chanderpur-works-pvt-ltd', 'chanderpur-works-pvt-ltd.webp', 'chanderpur-works-pvt-ltd-banner.webp', 'Since 1962, our flagship company has been a trusted leader in industrial engineering, manufacturing machinery for 	Cement Plants, Fertilizer Units, Mineral Processing, and Biomass-Based Power Solutions', 'Chanderpur Works Pvt. Ltd. has been a trusted name in engineering and machinery manufacturing since 1962.', '<p>We have a reputation for providing reliable solutions over the decades in industries like cement plants, fertilizer plants, mineral processing equipment and Gasifier Plants (Biomass Gasifier Plants &amp; MSW Gasifier Plants).</p><p>We collaborate closely with our clients to make their ideas a reality and provide them with a full EPC (Engineering, Procurement, and Construction) solution and tailored industrial equipment production according to the project demands.</p><p>We are dedicated to quality, and this has seen us gain recognition as a Star Export House by the Government of India, as well as ISO 9001 certification. About half of our business today is through global exports, and we are present in various continents. Our cement division has benefacted customers in Kenya, Sudan, Zambia, Nepal, Yemen, Djibouti, Bolivia, and Egypt, and our renewable energy products are commonly utilized in Europe and the United States.</p><p>Our superior in-house design, manufacturing, inspection and testing are what make us really special. We have a well-trained team of about 800 employees, and this has guaranteed accuracy and uniformity throughout the process. We continuously invest in cutting-edge software like Oracle ERP systems, SolidWorks, DriveWorks, AutoCAD, and STAAD to increase productivity and accuracy.</p><p>To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.</p><p>To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.</p>', 1, 2, 'Chanderpur Works Pvt. Ltd. | Chanderpur', '', '', '', '2026-04-25 11:42:31', 'Admin Panel', '2026-06-11 13:25:35'),
(2, 'Chanderpur Industries Pvt. Ltd.', 'chanderpur-industries-pvt-ltd', 'chanderpur-industries-pvt-ltd.webp', 'chanderpur-industries-pvt-ltd-banner.webp', 'The company is dedicated to manufacturing high-quality equipment. A state-of-the-art facility producing equipment for Oil & Gas, Petrochemical, Oleo Chemicals/Fatty Acid, Defence, Aerospace, and Nuclear industries, certified with ASME U Stamp & R Stamp. ', 'Chanderpur Works Pvt. Ltd. has been a trusted name in engineering and machinery manufacturing since 1962.', '<p>We have a reputation for providing reliable solutions over the decades in industries like cement plants, fertilizer plants, mineral processing equipment and Gasifier Plants (Biomass Gasifier Plants &amp; MSW Gasifier Plants).We collaborate closely with our clients to make their ideas a reality and provide them with a full EPC (Engineering, Procurement, and Construction) solution and tailored industrial equipment production according to the project demands.We are dedicated to quality, and this has seen us gain recognition as a Star Export House by the Government of India, as well as ISO 9001 certification. About half of our business today is through global exports, and we are present in various continents. Our cement division has benefacted customers in Kenya, Sudan, Zambia, Nepal, Yemen, Djibouti, Bolivia, and Egypt, and our renewable energy products are commonly utilized in Europe and the United States.Our superior in-house design, manufacturing, inspection and testing are what make us really special. We have a well-trained team of about 800 employees, and this has guaranteed accuracy and uniformity throughout the process. We continuously invest in cutting-edge software like Oracle ERP systems, SolidWorks, DriveWorks, AutoCAD, and STAAD to increase productivity and accuracy.To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.To address changing project needs, our teams are educated on modern tools of project management like MS Project and Primavera software, which enable the project delivery on time and smooth execution.</p>', 1, 3, 'Chanderpur Industries Pvt. Ltd. | Chanderpur', '', '', '', '2026-06-06 17:31:06', 'Admin Panel', '2026-06-06 17:31:06');

-- --------------------------------------------------------

--
-- Table structure for table `mst_contact_us`
--

CREATE TABLE `mst_contact_us` (
  `ContactID` int(11) NOT NULL,
  `VendorID` int(11) DEFAULT NULL,
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
(72, 0, 'Azeem Rza', 'developer@prettifycreative.com', '+91-7017637257', 'PCI', 'Testing Here', 'Normal Enquiry', 'Get Expert Advisory', 'India', '/', '2026-03-23 04:52:32', 0);

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
(1, 'Shri Sumesh Chandra  ', 'Founder', '<p><strong>Our Inspiration (29/03/1933 - 23/09/2013)</strong></p><p>    Sh. Sumesh Chandra founded Chanderpur Group in 1962 with the successful establishment of the parent company, Chanderpur Works Pvt. Ltd. He started this company as a fabrication unit, and later on, he took this company to new heights by adding a new business sphere of machinery manufacturing for the paper industry.  </p><p>    There have been many developments during his career that brought revolution to the group. A few of them include Rotary Spherical Digesters and Rice Husk Fired Boilers.  </p><p>    Throughout his life, he has been concerned about the company’s labourers, their families, and the betterment of their lives.  </p><p>    For social welfare, he established a charitable eye hospital in 1972. His motive behind this establishment was: “In his city, none should suffer eye-related health problems due to financial limitations.”  </p>', 'shri-sumesh-chandra.webp', 1, 1, '2026-04-25 11:26:08', 'Admin Panel', '2026-06-06 17:44:21'),
(2, 'Mr. Sunil Chandra', 'Managing Director', '<p>Mr. Sunil Chandra is a third-generation entrepreneur and founder of the company’s Cement Division. He serves as the Chairman of Christian Pfeiffer India and MD of Chanderpur Industries Private Limited. Under his wide experience of 35 years in Project Execution and Sales, CPG feels proud to have a leader and visionary guiding us through our journey of becoming a Global Player in the field of Process Plant Manufacturing and Engineering.</p>', 'mr-sunil-chandra.webp', 1, 2, '2026-04-25 11:29:42', 'Admin Panel', '2026-06-06 18:55:37'),
(3, 'Mr. Sudhir Chandra', 'Managing Director', '<p>    Mr. Sudhir Chandra has successfully led the company to be a landmark in the field of heavy equipment manufacturing. A technocrat having a Mechanical Engineering Degree from NIT Kurukshetra and Post Graduate in Cement Technology, he is the Managing Director of Chanderpur Works Pvt. Ltd. and looks after the Administration, Finance, and Manufacturing departments. His love for academics has led the company to be ahead in Fabrication Technology and in managing taxation and company laws most effectively.  </p><p> </p><p>    With his strength and vision, the company started the Renewable Energy division (Biomass Gasifiers) in the year 1999, which is now one of our most successful products in Europe and other developed countries.  </p>', 'mr-sudhir-chandra.webp', 1, 3, '2026-04-25 11:30:08', 'Admin Panel', '2026-06-06 17:45:18');

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
(1, 'Machining Facilities', 'machining-facilities', 'High-precision machining for superior performance.', 'machining-facilities.png', 'machining-facilities-banner.png', 'We are well supported by well-laid Machining Facilities that are installed to meet the challenges and complex requirements of global markets. In our facility, we ensure to follow all the international trends in product development that support the overall growth of the company.', '', 1, 1, 'Machining Facilities | Chanderpur', '', '', '', '2026-05-13 15:36:26', 'Admin Panel', '2026-06-11 13:46:56'),
(2, 'Fabrication Facilities', 'fabrication-facilities', 'High-precision machining for superior performance.', 'fabrication-facilities.png', 'fabrication-facilities-banner.png', 'We are fully facilitated with highly sophisticated and advanced Fabrication Facilities. Equipped with techniques like roll bending, CNC oxy cutting, CNC plasma cutting, shearing and edge bending, our fabrication unit has an excellent capacity of handling maximum production without any glitches.', '', 2, 1, 'Fabrication Facilities | Chanderpur', '', '', '', '2026-05-13 15:38:04', 'Admin Panel', '2026-06-11 13:47:35');

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
(1, 1, 'CNC 5 - Axis Milling Machine (Make - Italy)', 'cnc-5---axis-milling-machine-make---italy', 'cnc-5---axis-milling-machine-make---italy.png', 'cnc-5---axis-milling-machine-make---italy_1.png', 'cnc-5---axis-milling-machine-make---italy_2.png', 'cnc-5---axis-milling-machine-make---italy_3.png', '<table> <tbody><tr> <th><div>Technical Details</div></th> <th><div>Sizes</div></th> </tr> <tr> <td><div>Control</div></td> <td><div>Heidenhain iTNC 530 HSC</div></td> </tr> <tr> <td><div>Travel X</div></td> <td><div>10.000 mm</div></td> </tr> <tr> <td><div>Travel Y</div></td> <td><div>4.000 mm</div></td> </tr> <tr> <td><div>Travel Z</div></td> <td><div>1750 mm</div></td> </tr> <tr> <td><div>Distance Between Columns</div></td> <td><div>5000 mm</div></td> </tr> <tr> <td><div>Spindle Speed</div></td> <td><div>up to 5000 rpm</div></td> </tr> <tr> <td><div>ATC</div></td> <td><div>180 Places</div></td> </tr></tbody></table>', 1, 1, '2026-05-13 15:42:01', 'Admin Panel', '2026-06-11 13:36:17'),
(2, 1, 'CNC 5 - Axis Milling Machine Italy', 'cnc-5---axis-milling-machine-italy', 'cnc-5---axis-milling-machine-italy.svg', 'cnc-5---axis-milling-machine-italy_1.svg', 'cnc-5---axis-milling-machine-italy_2.svg', 'cnc-5---axis-milling-machine-italy_3.svg', '<table> <tbody> <tr> <th> <div>Technical Details</div> </th> <th> <div>Sizes</div> </th> </tr> <tr> <td> <div>Control</div> </td> <td> <div>Heidenhain iTNC 530 HSC</div> </td> </tr> <tr> <td> <div>Travel X</div> </td> <td> <div>10.000 mm</div> </td> </tr> <tr> <td> <div>Travel Y</div> </td> <td> <div>4.000 mm</div> </td> </tr> <tr> <td> <div>Travel Z</div> </td> <td> <div>1750 mm</div> </td> </tr> <tr> <td> <div>Distance Between Columns</div> </td> <td> <div>5000 mm</div> </td> </tr> <tr> <td> <div>Spindle Speed</div> </td> <td> <div>up to 5000 rpm</div> </td> </tr> <tr> <td> <div>ATC</div> </td> <td> <div>180 Places</div> </td> </tr> </tbody></table>', 2, 1, '2026-06-11 13:34:18', 'Admin Panel', '2026-06-11 13:36:19');

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
(3, 'In House Manufacturing Excellence', 'in-house-manufacturing-excellence', 'in-house-manufacturing-excellence.mp4', 1, 2, '2026-05-12 15:50:52', 'Admin Panel', '2026-06-06 18:15:20'),
(4, 'In-House Manufacturing Excellence Begins', 'in-house-manufacturing-excellence-begins', 'in-house-manufacturing-excellence-begins.mp4', 1, 1, '2026-06-06 16:36:19', 'Admin Panel', '2026-06-06 18:15:20');

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
(1, 'Since 1962', 'since-1962', 'since-1962.webp', '1962', '<p>Chanderpur Group was established, and its first company, Chanderpur Works Pvt. Ltd commenced with supplying sugar machinery to the sugar industry.</p>', 1, 1, '2026-04-25 11:48:26', 'Admin Panel', '2026-06-08 10:32:12'),
(2, 'Since 1970', '1970', '1970.webp', '1970', '<p>Ventured into the production of machinery in the paper industry.</p>', 1, 2, '2026-06-06 17:32:07', 'Admin Panel', '2026-06-08 10:32:14'),
(3, 'Since 1971', 'since-1971', 'since-1971.webp', '1971', '<p>Our first pulping equipment was supplied, and our presence in paper processing was initiated.</p>', 1, 3, '2026-06-06 17:32:43', 'Admin Panel', '2026-06-08 10:32:16');

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
(3, '1778750755100.png', 1, 1, 3, '2026-05-14 14:55:55', 'Admin Panel', '2026-05-14 14:55:55'),
(4, '1780743650347.webp', 1, 1, 4, '2026-06-06 16:30:50', 'Admin Panel', '2026-06-06 16:31:15'),
(5, '1780743658201.webp', 1, 1, 5, '2026-06-06 16:30:58', 'Admin Panel', '2026-06-06 16:31:11'),
(6, '1780743666787.webp', 1, 1, 6, '2026-06-06 16:31:06', 'Admin Panel', '2026-06-06 16:31:06'),
(7, '1780743681961.webp', 1, 1, 7, '2026-06-06 16:31:21', 'Admin Panel', '2026-06-06 16:31:42'),
(8, '1780743690946.webp', 1, 1, 8, '2026-06-06 16:31:30', 'Admin Panel', '2026-06-06 16:31:46'),
(9, '1780743698250.webp', 1, 1, 9, '2026-06-06 16:31:38', 'Admin Panel', '2026-06-06 16:31:49');

-- --------------------------------------------------------

--
-- Table structure for table `mst_productcircuits`
--

CREATE TABLE `mst_productcircuits` (
  `CircuitId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ImageUrl` varchar(500) NOT NULL,
  `Description` text DEFAULT NULL,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_productcircuits`
--

INSERT INTO `mst_productcircuits` (`CircuitId`, `ProductId`, `ImageUrl`, `Description`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 1, 'Frame-circuit_99.webp', 'sfsf', 2, 1, '2026-06-08 17:39:47', NULL, '2026-06-08 17:39:47'),
(2, 1, 'Jagdamba-circuit_34.svg', 'saf', 2, 1, '2026-06-08 17:40:11', NULL, '2026-06-08 17:40:11'),
(3, 2, 'circuit-circuit_80.webp', 'Available Types of Wet and Dry Grinding Applications', 1, 1, '2026-06-10 17:14:13', NULL, '2026-06-10 17:14:13'),
(4, 2, 'circuit-circuit_26.webp', 'Available Types of Wet and Dry Grinding Applications', 2, 1, '2026-06-10 17:14:37', NULL, '2026-06-10 17:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `mst_productdrives`
--

CREATE TABLE `mst_productdrives` (
  `DriveId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `IconImage` varchar(500) DEFAULT NULL,
  `DefaultImage` varchar(255) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Tagline` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_productdrives`
--

INSERT INTO `mst_productdrives` (`DriveId`, `ProductId`, `IconImage`, `DefaultImage`, `Title`, `Tagline`, `Description`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 1, 'products-drive_30.webp', NULL, 'afadad', 'adad', 'ad', 1, 1, '2026-06-08 17:40:42', NULL, '2026-06-08 17:40:42'),
(2, 2, 'setting-drive_58.svg', 'girth-drive-default_88.webp', 'Girth Gear and Pinion Drive', 'Ideally suited for heavy-duty Ball Mills', 'A classic and robust design meant for all site locations, user friendly, low maintenance, less capital cost, easy availability of spares.', 1, 1, '2026-06-10 17:15:56', NULL, '2026-06-11 12:46:20'),
(3, 2, 'axis-drive_90.svg', 'girth-drive-default_69.webp', 'Central Drive', 'For milling materials efficiently through controlled', 'A classic and robust design meant for all site locations, user friendly, low maintenance, less capital cost, easy availability of spares.', 2, 1, '2026-06-10 17:16:33', NULL, '2026-06-11 12:32:43'),
(4, 2, 'cube-drive_17.svg', 'girth-drive-default_63.webp', 'Integral Drive', 'Compact design ideal for high-capacity Ball Mills Operations', 'A classic and robust design meant for all site locations, user friendly, low maintenance, less capital cost, easy availability of spares. ', 3, 1, '2026-06-10 17:17:12', NULL, '2026-06-11 12:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `mst_productgallery`
--

CREATE TABLE `mst_productgallery` (
  `GalleryId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ImageUrl` varchar(500) NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_productgallery`
--

INSERT INTO `mst_productgallery` (`GalleryId`, `ProductId`, `ImageUrl`, `Title`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 2, '1-gallery_12.webp', 'Balli Mill Image 1', 1, 1, '2026-06-10 17:13:07', NULL, '2026-06-10 17:13:07'),
(2, 2, '3-gallery_12.webp', 'Balli Mill Image 2', 2, 1, '2026-06-10 17:13:18', NULL, '2026-06-10 17:13:18');

-- --------------------------------------------------------

--
-- Table structure for table `mst_producthighlights`
--

CREATE TABLE `mst_producthighlights` (
  `HighlightId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_producthighlights`
--

INSERT INTO `mst_producthighlights` (`HighlightId`, `ProductId`, `Title`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 1, 'testx  sfwfw wrwrwrwrwrwrwr wrwrwrtestx  sfwfw wrwrwrwrwrwrwr wrwrwrtestx  sfwfw wrwrwrwrwrwrwr wrwrwrtestx  sfwfw wrwrwrwrwrwrwr wrwrwr', 1, 1, '2026-06-08 17:37:57', NULL, '2026-06-10 16:19:13'),
(4, 2, '500+ installations', 1, 1, '2026-06-10 17:10:22', NULL, '2026-06-10 17:10:37'),
(5, 2, 'Heavy Manufacturing Capabilities - Dia: 5.0 and Length: 19 mtr', 2, 1, '2026-06-10 17:10:32', NULL, '2026-06-10 17:10:32'),
(6, 2, 'Open & Closed - Circuit Options', 3, 1, '2026-06-10 17:10:48', NULL, '2026-06-10 17:10:48'),
(7, 2, '500+ installations', 4, 1, '2026-06-10 17:11:04', NULL, '2026-06-10 17:11:04');

-- --------------------------------------------------------

--
-- Table structure for table `mst_products`
--

CREATE TABLE `mst_products` (
  `ProductId` int(11) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `ProductNameURL` varchar(255) NOT NULL,
  `ProductHeading` varchar(100) DEFAULT NULL,
  `ProductListDescription` text DEFAULT NULL,
  `ProductSmallDescription` text DEFAULT NULL,
  `ProductMedia` varchar(500) DEFAULT NULL,
  `Section1Title` varchar(255) DEFAULT NULL,
  `Section1Description` text DEFAULT NULL,
  `Section1MediaUrl` varchar(500) DEFAULT NULL,
  `Section3Title` varchar(255) DEFAULT NULL,
  `Section3Description` text DEFAULT NULL,
  `Section3MediaUrl` varchar(500) DEFAULT NULL,
  `Section4Title` varchar(255) DEFAULT NULL,
  `Section4Description` text DEFAULT NULL,
  `Section4MediaUrl` varchar(500) DEFAULT NULL,
  `Section5Title` varchar(255) DEFAULT NULL,
  `Section5Description` text DEFAULT NULL,
  `Section6Title` varchar(255) DEFAULT NULL,
  `Section6Description` text DEFAULT NULL,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `DisplayOnHeader` tinyint(1) NOT NULL DEFAULT 0,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `MetaTitle` varchar(255) DEFAULT NULL,
  `MetaKeywords` text DEFAULT NULL,
  `MetaDescriptions` text DEFAULT NULL,
  `MetaSchema` longtext CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_products`
--

INSERT INTO `mst_products` (`ProductId`, `ProductName`, `ProductNameURL`, `ProductHeading`, `ProductListDescription`, `ProductSmallDescription`, `ProductMedia`, `Section1Title`, `Section1Description`, `Section1MediaUrl`, `Section3Title`, `Section3Description`, `Section3MediaUrl`, `Section4Title`, `Section4Description`, `Section4MediaUrl`, `Section5Title`, `Section5Description`, `Section6Title`, `Section6Description`, `ActiveStatus`, `DisplayOnHeader`, `DisplayOrder`, `MetaTitle`, `MetaKeywords`, `MetaDescriptions`, `MetaSchema`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(2, 'Ball mill', 'ball-mill', 'Successful Installations', '<ul><li>Cement</li><li>Ore(Gold, Copper, Chrome, Iron etc)</li><li>Slag</li><li>Phosphate</li><li>Limestone, Dolomite, and Quick Lime</li><li>Coal/Petcoke</li><li>Wall Putty</li></ul>', 'Designed in collaboration with Christian Pfeiffer Maschinenfabrik GmbH, Germany.', '1-productmedia_32.webp', 'Grinding is not just about size reduction, although it defines plant performance ', '<p>            Our Ball Mills are the result of precision engineering and German            grinding experience, in collaboration with Christian Pfeiffer            Maschinenfabrik GmbH, Germany, specifically for Cement Grinding          </p><p> </p><p>            We bring forth a highly advanced Ball Mill, specifically engineered            for both types of cement grinding applications, i.e. &nbsp;Wet Cement            Grinding and Dry Cement Grinding. Classification ball mill depends            on the circuit design, bearing, grinding type and drive. The            selection is made based on the product fineness, quality, and nature            of raw material, site conditions and specific requirements.          </p>', 'ball-section1mediaurl_90.webp', 'Successful Ball Mill Installations', '<ul><li>Grey &amp; White Cement</li><li>Silica Manganese</li><li>Limestone</li><li>Phosphate</li><li>Coal</li><li>Slag</li><li>Chrome Ore</li><li>Pet coke</li><li>Iron Ore</li><li>Alumina</li></ul>', 'success-section3mediaurl_89.webp', 'Ball Mill Selection Guide', '<p>Selection of Ball Mill is done as per product quality, fineness, nature of raw material, site conditions and specific requirements like:</p><ul><li>Open circuit or closed circuit</li><li>Wet or Dry Grinding</li><li>Slide shoe bearing or Trunion Bearing</li><li>Central Drive or Girth Gear Pinion Drive</li></ul>', NULL, 'Cutting-Edge Ball Mill Technology', '<p>Chanderpur Group brings together years of expertise in manufacturing in partnership with Christian Pfeiffer Maschinenfabrik GmbH, Germany, to offer high – quality ball mill systems for the cement sector.</p><p>Widely recognized for its resilient designs, CPG comes with different designs for both wet and dry grinding, offering reliable grinding systems for diverse industrial applications.</p><p>CPG can offer two types of bearing design of Ball mill:</p>', 'Choose Your Drive', '<p>As per customer choice and requirement, CPG offers ball mills with three drive options</p>', 1, 1, 1, 'Ball mill | Chanderpur Group', '', '', '', '2026-06-10 17:05:10', NULL, '2026-06-12 11:15:16');

-- --------------------------------------------------------

--
-- Table structure for table `mst_producttechnology`
--

CREATE TABLE `mst_producttechnology` (
  `TechnologyId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `ActiveStatus` tinyint(1) NOT NULL DEFAULT 1,
  `PostedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_producttechnology`
--

INSERT INTO `mst_producttechnology` (`TechnologyId`, `ProductId`, `Title`, `Description`, `DisplayOrder`, `ActiveStatus`, `PostedDate`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 1, 'sfsf', 'sfsfsfsf', 1, 1, '2026-06-08 17:40:21', NULL, '2026-06-08 17:40:21'),
(2, 1, 'wr', '7845', 2, 1, '2026-06-08 17:40:29', NULL, '2026-06-08 17:40:29'),
(3, 2, 'Highlights of Trunion Ball Mills', '<ul><li>White Metal Bearing</li><li>Best known for easy operational benefits</li><li>Designs of ball mills for all sizes of applications</li><li>Self-Aligned Trunion bush bearing</li><li>Close sealed bearing ensures better resistance to dust particles</li><li>Oil housing with inspection door and proper sealing to avoid leakages</li><li>Provided with pre-jacking oil lubrication system</li><li>Manufactured using CNC profile machining crate</li><li>White metal lining is ultrasonically tested before supply</li><li>Designed for heavy-duty industrial Ball Mills and long-lasting performance</li></ul>', 1, 1, '2026-06-10 17:22:08', NULL, '2026-06-11 12:52:07'),
(4, 2, 'Highlights of Slide Shoe Ball Mills', '<ul><li>Hydrodynamic / Hydrostatic lubrication system</li><li>Eliminates the need for heavy, cast trunions</li><li>Best suited for large-diameter and high-capacity ball mills</li><li>Uniform shell stress distribution, reducing structural fatigue</li><li>Saves space and reduces overall foundation loads</li><li>Easy inspection and replacement of individual shoe pads</li><li>Low startup friction and energy consumption</li><li>Equipped with high-precision oil pressure monitoring systems</li></ul>', 2, 1, '2026-06-10 17:22:35', NULL, '2026-06-11 12:52:09');

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
(3, 'About us', 'about-us', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'About us | Chanderpur', '', '', '', '2026-06-06 09:59:38', 'Admin Panel', '2026-06-06 09:59:38'),
(4, 'Blogs', 'blogs', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Blogs | Chanderpur', '', '', '', '2026-06-06 09:59:46', 'Admin Panel', '2026-06-06 09:59:46'),
(5, 'Career', 'career', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Career | Chanderpur', '', '', '', '2026-06-06 09:59:59', 'Admin Panel', '2026-06-06 09:59:59'),
(6, 'Client Testimonials', 'client-testimonials', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Client Testimonials | Chanderpur', '', '', '', '2026-06-06 10:00:15', 'Admin Panel', '2026-06-06 10:00:15'),
(7, 'Companies', 'companies', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Companies | Chanderpur', '', '', '', '2026-06-06 10:00:29', 'Admin Panel', '2026-06-06 10:00:29'),
(8, 'Contact us', 'contact-us', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Contact us | Chanderpur', '', '', '', '2026-06-06 10:00:42', 'Admin Panel', '2026-06-06 10:00:42'),
(9, 'Gallery', 'gallery', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Gallery | Chanderpur', '', '', '', '2026-06-06 10:00:53', 'Admin Panel', '2026-06-06 10:00:53'),
(10, 'Manufacturing Facilities', 'manufacturing-facilities', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Manufacturing Facilities | Chanderpur', '', '', '', '2026-06-06 10:04:29', 'Admin Panel', '2026-06-06 10:04:29'),
(11, 'Our Clients', 'our-clients', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Our Clients | Chanderpur', '', '', '', '2026-06-06 10:04:43', 'Admin Panel', '2026-06-06 10:04:43'),
(12, 'Our Policies', 'our-policies', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Our Policies | Chanderpur', '', '', '', '2026-06-06 10:04:58', 'Admin Panel', '2026-06-06 10:04:58'),
(13, 'Our Presence', 'our-presence', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Our Presence | Chanderpur', '', '', '', '2026-06-06 10:05:15', 'Admin Panel', '2026-06-06 10:05:15'),
(14, 'Privacy Policy', 'privacy-policy', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Privacy Policy | Chanderpur', '', '', '', '2026-06-06 10:05:52', 'Admin Panel', '2026-06-06 10:05:52'),
(15, 'Products', 'products', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Products | Chanderpur', '', '', '', '2026-06-06 10:06:05', 'Admin Panel', '2026-06-06 10:06:05'),
(16, 'Something Went Wrong', 'something-went-wrong', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Something Went Wrong | Chanderpur', '', '', '', '2026-06-06 10:06:24', 'Admin Panel', '2026-06-06 10:06:24'),
(17, 'Terms of Service', 'terms-of-service', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Terms Of Service | Chanderpur', '', '', '', '2026-06-06 10:06:41', 'Admin Panel', '2026-06-06 10:46:04'),
(18, 'Turnkey Projects', 'turnkey-projects', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Turnkey Projects | Chanderpur', '', '', '', '2026-06-06 10:06:57', 'Admin Panel', '2026-06-06 10:06:57'),
(19, 'Vendor Opportunities', 'vendor-opportunities', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Vendor Opportunities | Chanderpur', '', '', '', '2026-06-06 10:07:13', 'Admin Panel', '2026-06-06 10:07:13'),
(20, 'Quality Assurance Policy', 'quality-assurance-policy', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Quality Assurance Policy | Chanderpur', '', '', '', '2026-06-06 10:24:41', 'Admin Panel', '2026-06-06 10:24:41'),
(21, 'Environmental, Health, and Safety', 'environmental-health-and-safety', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Environmental, Health, and Safety | Chanderpur', '', '', '', '2026-06-06 10:25:03', 'Admin Panel', '2026-06-06 10:25:03'),
(22, 'HR Policy', 'hr', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'HR Policy | Chanderpur', '', '', '', '2026-06-06 10:25:23', 'Admin Panel', '2026-06-06 10:25:23'),
(23, 'Employee Code of Conduct Policy', 'employee-code-of-conduct', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Employee Code of Conduct Policy | Chanderpur', '', '', '', '2026-06-06 10:25:41', 'Admin Panel', '2026-06-06 10:25:41'),
(24, 'Data Security and Privacy Policy', 'data-security', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Data Security and Privacy Policy | Chanderpur', '', '', '', '2026-06-06 10:26:08', 'Admin Panel', '2026-06-06 10:40:40'),
(25, 'Photo Gallery', 'image', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Photo Gallery | Chanderpur', '', '', '', '2026-06-06 10:31:50', 'Admin Panel', '2026-06-06 10:31:50'),
(26, 'Video Gallery', 'video', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Video Gallery | Chanderpur', '', '', '', '2026-06-06 10:32:08', 'Admin Panel', '2026-06-06 10:32:08'),
(27, 'What’s New', 'whats-new', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'What’s New | Chanderpur', '', '', '', '2026-06-06 11:53:17', 'Admin Panel', '2026-06-06 11:53:17'),
(28, 'Quality Assurance', 'quality-assurance', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Quality Assurance | Chanderpur', '', '', '', '2026-06-11 10:02:47', 'Admin Panel', '2026-06-11 10:02:47'),
(29, 'Tool Room', 'tool-room', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Tool Room | Chanderpur', '', '', '', '2026-06-11 10:03:48', 'Admin Panel', '2026-06-11 10:03:48'),
(30, 'Foundry', 'foundry', NULL, NULL, '', '', 1, '', '', '', '', '', '', '', '', '', '', '', '', 'Foundry | Chanderpur', '', '', '', '2026-06-11 10:04:21', 'Admin Panel', '2026-06-11 10:04:21');

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
(1, 'Sulux Phosphate Ltd.', 'sulux-phosphate-ltd', 'sulux-phosphate-ltd.svg', '<p>We are having 3 Nos. of 300 TPD Ball Mills supplied by Chanderpur Works Pvt. Ltd., Yamunanagar at our plant in Birgunj. The mills are performing satisfactorily.</p>', 1, 1, 1, '2026-04-25 11:11:10', 'Admin Panel', '2026-06-08 16:07:10'),
(2, 'TATA Power', 'tata-power', 'tata-power.svg', '<p>14 KW Biomass project at Trombay colony TATA Power has successfully commissioned. Thanks for your co-operation and support. Your representative has done great job and because of him project completed in schedule time. We required your help for synchronizing scheme for same project.</p>', 1, 2, 1, '2026-04-25 11:11:46', 'Admin Panel', '2026-06-08 16:07:46'),
(3, 'Swastik Pipes Ltd.', 'swastik-pipes-ltd', 'swastik-pipes-ltd.svg', '<p>This is to certify that the fuel replaced Gasifier having capacity of 150 Litres Furnace Oil replacement, supplied by M/s Chanderpur Works, Village-Jorian, Yamuna Naga, Haryana is under our operation for galvanizing plant. The performance of the said Gasifier is found satisfactory.</p>', 1, 3, 1, '2026-06-06 16:42:57', 'Admin Panel', '2026-06-06 16:42:57'),
(4, 'Jagdamba Cement Industries Pvt. Ltd. ', 'jagdamba-cement-industries-pvt-ltd', 'jagdamba-cement-industries-pvt-ltd.svg', '<p>We hereby state that we had placed an order for 1 unit of 300 TPD Cement Grinding Unit through our L/C No. HBLIU01630026 dated 22.08.06 to M/s Chanderpur Works, Yamunanagar, India and they have successfully supplied us the complete unit, commissioned the same and at present the Unit is running satisfactorily.</p>', 1, 4, 1, '2026-06-06 18:27:27', 'Admin Panel', '2026-06-06 18:27:27'),
(5, 'Evergreen Holdings Ltd.', 'evergreen-holdings-ltd', 'evergreen-holdings-ltd.svg', '<p>This is certify that 50 TPH Grinding Unit supplied by M/s Chanderpur Works (P) Ltd, Yamuna Nagar, Haryana, India is working satisfactory and has achieved the rated capacity. We are quite pleased by their customer services and wish them to very best for the future.</p>', 1, 5, 1, '2026-06-08 11:16:14', 'Admin Panel', '2026-06-08 11:16:14');

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
(6, 'Video', 'Projects Executed', 'projects-executed-cover.png', 'https://www.youtube.com/embed/XucJoMOkrvQ?si=T9qHKrZ0T5aWUCnP', 1, '2026-05-12 16:39:18', 'Admin', '2026-05-12 16:39:18'),
(7, 'Image', 'Project Executed', 'project-executed-cover.png', '', 1, '2026-06-08 11:20:02', 'Admin', '2026-06-08 11:20:02'),
(8, 'Video', '400 kw dual fuel based gasifier (supplied & installed at Guyana)', '400-kw-dual-fuel-based-gasifier--supplied---installed-at-guyana--cover.webp', 'https://www.youtube.com/embed/XucJoMOkrvQ?si=T9qHKrZ0T5aWUCnP', 1, '2026-06-08 11:29:40', 'Admin', '2026-06-08 11:29:40'),
(9, 'Video', 'Biomass Power Plant', 'biomass-power-plant-cover.webp', 'https://www.youtube.com/embed/XucJoMOkrvQ?si=T9qHKrZ0T5aWUCnP', 1, '2026-06-08 11:30:19', 'Admin', '2026-06-08 11:30:19'),
(10, 'Video', 'In-House Facilities', 'in-house-facilities-cover.webp', 'https://www.youtube.com/embed/XucJoMOkrvQ?si=T9qHKrZ0T5aWUCnP', 1, '2026-06-08 11:30:51', 'Admin', '2026-06-08 11:30:51');

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

--
-- Dumping data for table `mst_webgalleryphotos`
--

INSERT INTO `mst_webgalleryphotos` (`photoID`, `galleryID`, `photoImage`, `updatedBy`, `updatedOn`) VALUES
(2, 5, 'products-1.png', 'Admin', '2026-06-08 11:19:23'),
(3, 5, 'products-2.png', 'Admin', '2026-06-08 11:19:27'),
(4, 7, 'project-executed-1.svg', 'Admin', '2026-06-08 11:20:20'),
(5, 7, 'project-executed-2.webp', 'Admin', '2026-06-08 11:20:25');

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
(1, 'We are thrilled to share an exciting acheivement', 'we-are-thrilled-to-share-an-exciting-acheivement', 'we-are-thrilled-to-share-an-exciting-acheivement.png', 'SiliconIndia Features Chanderpur Group Among \'10 Most Promising Waste-to-Energy Providers 2024', '<p>Our group company,&nbsp;Chanderpur Renewable Power Company Pvt. Ltd., has been honoured with the&nbsp;\"Recognition of In-House R&amp;D Unit\"&nbsp;by the&nbsp;Department of Scientific and Industrial Research (DSIR), Government of India.<br><br>This prestigious recognition is a testament to our continuous commitment to innovation, excellence in research and development, and our contribution to sustainable energy solutions.<br></p>', 1, 1, '2026-05-13 15:15:11', 'Admin Panel', '2026-06-08 11:10:20'),
(2, 'SiliconIndia Features Chanderpur Group Among \'10 Most Promising Waste-to-Energy Providers 2024', 'siliconindia-features-chanderpur-group-among-10-most-promising-waste-to-energy-providers-2024', 'siliconindia-features-chanderpur-group-among-10-most-promising-waste-to-energy-providers-2024.webp', 'SiliconIndia Features Chanderpur Group Among \'10 Most Promising Waste-to-Energy Providers 2024', '<p>Our group company, Chanderpur Renewable Power Company Pvt. Ltd., has been honoured with the \"Recognition of In-House R&amp;D Unit\" by the Department of Scientific and Industrial Research (DSIR), Government of India.This prestigious recognition is a testament to our continuous commitment to innovation, excellence in research and development, and our contribution to sustainable energy solutions.</p>', 2, 1, '2026-06-06 17:26:22', 'Admin Panel', '2026-06-06 17:26:22');

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
-- Indexes for table `mst_contact_us`
--
ALTER TABLE `mst_contact_us`
  ADD PRIMARY KEY (`ContactID`);

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
-- Indexes for table `mst_productcircuits`
--
ALTER TABLE `mst_productcircuits`
  ADD PRIMARY KEY (`CircuitId`);

--
-- Indexes for table `mst_productdrives`
--
ALTER TABLE `mst_productdrives`
  ADD PRIMARY KEY (`DriveId`);

--
-- Indexes for table `mst_productgallery`
--
ALTER TABLE `mst_productgallery`
  ADD PRIMARY KEY (`GalleryId`);

--
-- Indexes for table `mst_producthighlights`
--
ALTER TABLE `mst_producthighlights`
  ADD PRIMARY KEY (`HighlightId`);

--
-- Indexes for table `mst_products`
--
ALTER TABLE `mst_products`
  ADD PRIMARY KEY (`ProductId`),
  ADD UNIQUE KEY `uq_ProductNameURL` (`ProductNameURL`);

--
-- Indexes for table `mst_producttechnology`
--
ALTER TABLE `mst_producttechnology`
  ADD PRIMARY KEY (`TechnologyId`);

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
  MODIFY `AwardLogoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mst_blogdata`
--
ALTER TABLE `mst_blogdata`
  MODIFY `BlogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_careerdata`
--
ALTER TABLE `mst_careerdata`
  MODIFY `CareerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mst_clientlogomapping`
--
ALTER TABLE `mst_clientlogomapping`
  MODIFY `MappingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `mst_clienttype`
--
ALTER TABLE `mst_clienttype`
  MODIFY `ClientTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_collaborationdata`
--
ALTER TABLE `mst_collaborationdata`
  MODIFY `CollaborationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_companydata`
--
ALTER TABLE `mst_companydata`
  MODIFY `CompanyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_contact_us`
--
ALTER TABLE `mst_contact_us`
  MODIFY `ContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

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
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_manufacturing`
--
ALTER TABLE `mst_manufacturing`
  MODIFY `ManufacturingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mst_ourmilestonedata`
--
ALTER TABLE `mst_ourmilestonedata`
  MODIFY `MilestoneID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mst_partnerlogodata`
--
ALTER TABLE `mst_partnerlogodata`
  MODIFY `PartnerLogoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mst_productcircuits`
--
ALTER TABLE `mst_productcircuits`
  MODIFY `CircuitId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mst_productdrives`
--
ALTER TABLE `mst_productdrives`
  MODIFY `DriveId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mst_productgallery`
--
ALTER TABLE `mst_productgallery`
  MODIFY `GalleryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_producthighlights`
--
ALTER TABLE `mst_producthighlights`
  MODIFY `HighlightId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mst_products`
--
ALTER TABLE `mst_products`
  MODIFY `ProductId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mst_producttechnology`
--
ALTER TABLE `mst_producttechnology`
  MODIFY `TechnologyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mst_staticdata`
--
ALTER TABLE `mst_staticdata`
  MODIFY `StaticID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `mst_testimonialdata`
--
ALTER TABLE `mst_testimonialdata`
  MODIFY `TestimonialID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `galleryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mst_webgalleryphotos`
--
ALTER TABLE `mst_webgalleryphotos`
  MODIFY `photoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mst_whatsnewdata`
--
ALTER TABLE `mst_whatsnewdata`
  MODIFY `WhatsNewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
