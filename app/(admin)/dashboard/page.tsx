"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sun, Users, Award, Calendar, ChevronRight } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const SummerLeagueWelcome = () => {
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
      color: "bg-primary-yellow text-primary-yellow-foreground",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Teams",
      value: "30",
      color: "bg-primary-green text-primary-green-foreground",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Days",
      value: "13",
      color: "bg-primary text-primary-foreground",
    },
  ];

  const divisions = ["Sin", "Mion", "Djo", "Ayi"];

  return (
    <ContentLayout title="Welcome">
      <motion.div
        className="mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="mb-8 border-primary-yellow shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sun className="w-8 h-8 text-primary-yellow mr-2" />
                </motion.div>
                Welcome to the I AM FOUNDATION Summer League!
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Please wait while we assign your role. In the meantime,
                here&#39;s some information about our league.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-base">
              <p className="mb-4">
                The Summer League is an initiative by Ian MAHINMI&#39;s I AM
                FOUNDATION, aiming to promote basketball among Benin&#39;s youth
                and provide a platform for young professionals in sports-related
                careers.
              </p>
              <p>
                Our league features players aged 14-16 and young professionals,
                embodying values of fair play, teamwork, and professional
                sportsmanship.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {stats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card
                className={`${stat.color} hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-lg`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {stat.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border-primary-green shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                League Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base">
              <p className="mb-4">
                Our league is divided into {divisions.length} divisions:
              </p>
              <ul className="list-none mb-4">
                {divisions.map((division, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center mb-2 text-lg"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary-green mr-2" />
                    {division} Division
                  </motion.li>
                ))}
              </ul>
              <p>
                The league consists of 120 division matches, 98 conference
                matches, and 7 playoff matches, culminating in an exciting
                finale to crown the I AM FOUNDATION SUMMER League champion.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Stay tuned for your role assignment and get ready for an amazing
                summer of basketball!
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </ContentLayout>
  );
};

export default SummerLeagueWelcome;
