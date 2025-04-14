"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllDivisions } from "@/lib/api/division/division";
import { Division } from "@/types/division/divisionType";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  ChevronRight,
  Sun,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const SummerLeagueWelcome = () => {
  const [loading, setLoading] = useState(true);
  const [competitionDivisions, setCompetitionDivisions] = useState<
    Division[] | null
  >(null);

  useEffect(() => {
    const getDivision = async () => {
      setLoading(true);
      try {
        const selectedCompetitionId = localStorage.getItem(
          "selectedCompetitionId"
        );

        if (!selectedCompetitionId) {
          setCompetitionDivisions([]);
          return;
        }

        const response = await getAllDivisions(selectedCompetitionId);
        console.log(response);

        setCompetitionDivisions(response);
      } catch (error) {
        setCompetitionDivisions([]);
      } finally {
        setLoading(false);
      }
    };

    getDivision();
  }, []);

  const getUniqueDivisions = () => {
    if (!competitionDivisions) return [];
    return Array.from(
      new Set(competitionDivisions.map((division) => division.divisionName))
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Participants",
      value: "440",
      color:
        "bg-primary-yellow text-primary-yellow-foreground text-primary-yellow-foreground",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Teams",
      value: "30",
      color:
        "bg-primary-green text-primary-green-foreground text-primary-green-foreground",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Days",
      value: "13",
      color: "bg-primary text-primary-foreground text-primary-foreground",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-r from-primary/20 to-primary/20 rounded-bl-[100px] -z-10" />

      <ContentLayout title="Welcome">
        <motion.div
          className="px-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-10">
            <Card className="overflow-hidden border-0 shadow-xl rounded-2xl bg-primary/10">
              <div className="relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-400/30 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/30 to-transparent rounded-tr-full" />

                <CardHeader className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-2"
                  >
                    <div className="p-2 bg-primary rounded-full">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sun className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    <CardTitle className="text-1xl md:text-3xl font-extrabold text-gray-800">
                      I AM FOUNDATION Summer League
                    </CardTitle>
                  </motion.div>
                  <CardDescription className="text-lg text-gray-600">
                    Please wait while we assign your role. In the meantime,
                    explore what makes our league special.
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Our Mission
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        The Summer League is Ian MAHINMI&apos;s I AM
                        FOUNDATION&apos;s initiative to promote basketball among
                        Benin&apos;s youth and create opportunities for young
                        professionals in sports-related careers.
                      </p>
                      <div className="mt-6 flex gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-yellow text-amber-800">
                          Fair Play
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-green text-white">
                          Teamwork
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                          Sportsmanship
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <motion.div
                        initial={{ y: 10 }}
                        animate={{ y: -10 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="relative"
                      >
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary-foreground/20 flex items-center justify-center">
                          <Trophy className="w-20 h-20 text-black" />
                        </div>
                        <div className="absolute -bottom-4 w-full h-4 bg-black/10 blur-lg rounded-full transform scale-75" />
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`${stat.color} relative hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out rounded-xl border-0 overflow-hidden`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 bg-white/20 rounded-lg">
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <motion.div
                      className="text-4xl text-white/80 font-bold relative"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.06 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* League Structure */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-primary/10">
              <div className="bg-primary/10 py-4 px-6">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  League Structure
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Divisions
                    </h3>
                    <div className="space-y-3">
                      {loading ? (
                        <div className="animate-pulse bg-primary/30 rounded-lg h-8" />
                      ) : competitionDivisions?.length ? (
                        getUniqueDivisions().map((divisionName, index) => (
                          <motion.div
                            key={`${divisionName}-${index}`}
                            className="flex items-center bg-primary/10 p-3 rounded-lg"
                            whileHover={{ x: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <div className={`w-3 h-3 rounded-full mr-3`} />
                            <span>{divisionName} Division</span>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-500">No divisions found</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Tournament Format
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-600">
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                          <span>120 division matches</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                          <span>98 conference matches</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                          <span>7 playoff matches</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                          <span>1 championship final</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 rounded-lg border border-primary/10">
                      <p className="text-gray-600 text-sm font-medium">
                        Players aged 14-16 will compete alongside young
                        professionals, creating an exciting summer of basketball
                        talent. Stay tuned for your role assignment and get
                        ready for an amazing summer of basketball! The
                        championship begins soon.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </ContentLayout>
    </div>
  );
};

export default SummerLeagueWelcome;
