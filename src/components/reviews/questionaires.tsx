import React, { JSX } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "../ui/button";

/**
 * Type definitions for performance criteria and comment fields
 */
// Define as const objects instead of arrays to allow usage in both type and value contexts
const CRITERIA = {
  technicalSkills: "technicalSkills",
  communication: "communication",
  teamwork: "teamwork",
  problemSolving: "problemSolving",
  leadership: "leadership",
} as const;

const COMMENT_FIELDS = {
  technicalSkillsComments: "technicalSkillsComments",
  communicationComments: "communicationComments",
  teamworkComments: "teamworkComments",
  problemSolvingComments: "problemSolvingComments",
  leadershipComments: "leadershipComments",
} as const;

// Create types from those constants
type CriteriaName = (typeof CRITERIA)[keyof typeof CRITERIA];
type CommentFieldName = (typeof COMMENT_FIELDS)[keyof typeof COMMENT_FIELDS];

/**
 * Rating descriptions for better context
 */
const RATING_DESCRIPTIONS = {
  "1": "Needs significant improvement",
  "2": "Below expectations",
  "3": "Meets expectations",
  "4": "Exceeds expectations",
  "5": "Outstanding performance",
} as const;

const Questionnaire = ({ handlePrevious }: { handlePrevious: () => void }) => {
  /**
   * Criteria definitions with descriptions and related fields
   */
  const criteria = [
    {
      name: CRITERIA.technicalSkills as CriteriaName,
      label: "Technical Skills",
      description:
        "Knowledge and application of technical skills required for the role.",
      commentField: COMMENT_FIELDS.technicalSkillsComments as CommentFieldName,
    },
    {
      name: CRITERIA.communication as CriteriaName,
      label: "Communication",
      description:
        "Ability to communicate effectively with team members and stakeholders.",
      commentField: COMMENT_FIELDS.communicationComments as CommentFieldName,
    },
    {
      name: CRITERIA.teamwork as CriteriaName,
      label: "Teamwork",
      description: "Collaboration and contribution to team objectives.",
      commentField: COMMENT_FIELDS.teamworkComments as CommentFieldName,
    },
    {
      name: CRITERIA.problemSolving as CriteriaName,
      label: "Problem Solving",
      description:
        "Ability to identify, analyze, and resolve problems effectively.",
      commentField: COMMENT_FIELDS.problemSolvingComments as CommentFieldName,
    },
    {
      name: CRITERIA.leadership as CriteriaName,
      label: "Leadership",
      description: "Ability to guide, influence, and inspire others.",
      commentField: COMMENT_FIELDS.leadershipComments as CommentFieldName,
    },
  ];

  /**
   * RatingButtons Component
   *
   * Displays and handles the 1-5 rating buttons for each criterion
   *
   * @param {Object} props - Component props
   * @param {CriteriaName} props.fieldName - The form field name for this rating
   * @returns {JSX.Element} The rendered rating buttons
   */
  const RatingButtons = ({
    fieldName,
  }: {
    fieldName: CriteriaName;
  }): JSX.Element => {
    return (
      <div className="grid grid-cols-5 gap-1 text-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div
            key={rating}
            className={`
                  p-2 rounded-md cursor-pointer transition-all
                 bg-gray-50 border border-gray-200 hover:bg-gray-100
                `}
          >
            <div className="font-medium mb-1">{rating}</div>

            <div className="text-xs hidden md:block">
              {
                RATING_DESCRIPTIONS[
                  rating.toString() as keyof typeof RATING_DESCRIPTIONS
                ]
              }
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <div className="space-y-8 pt-4">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Performance Criteria</h3>
          <p className="text-sm text-muted-foreground">
            Rate the performance in each of the following areas on a scale of
            1-5.
          </p>
        </div>

        {/* Rating scale legend */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="w-1/4"></div>
          <div className="w-3/4 grid grid-cols-5 gap-1 text-center text-xs font-medium">
            {Object.entries(RATING_DESCRIPTIONS).map(([rating, desc]) => (
              <div key={rating} className="flex flex-col items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mb-1">
                  {rating}
                </span>
                <span className="hidden md:inline text-gray-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          {/* Criteria rating cards */}
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div
                key={criterion.name}
                className="bg-white p-4 rounded-md border border-gray-100 shadow-sm"
              >
                <div className="space-y-2">
                  {/* <div className="flex flex-col md:flex-row md:items-center">
                            <div className="w-full md:w-1/4">
                              <FormLabel className="text-base font-medium">
                                {criterion.label}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {criterion.description}
                              </FormDescription>
                            </div>
                            <div className="w-full md:w-3/4 mt-2 md:mt-0">
                              <RatingButtons fieldName={criterion.name} />
                            </div>
                          </div> */}

                  {/* Comments section for each criterion */}
                  {/* <FormField
                            control={form.control}
                            name={criterion.commentField}
                            render={({ field }) => (
                              <div className="mt-4">
                                <FormControl>
                                  <Textarea
                                    placeholder={`Optional comments about ${criterion.label.toLowerCase()}...`}
                                    className="min-h-[80px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Provide specific examples or context for your
                                  rating (optional)
                                </FormDescription>
                              </div>
                            )}
                          /> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        type="button" // Important: type="button" prevents form submission
        variant="outline"
        onClick={handlePrevious}
        disabled
        className="cursor-pointer"
      >
        Previous
      </Button>
    </>
  );
};

export default Questionnaire;
