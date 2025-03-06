export const jsonifyHelpData = {
  title: "JSONify",
  subtitle: "Learn how to use JSONify to format, escape, and manipulate JSON data.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdFormatAlignLeft",
          title: "Prettify",
          description: "Formats your JSON or text content to make it more readable.",
          input: `{"name":"John", "age":30}`,
          output: `{
  "name": "John",
  "age": 30
}`,
        },
        {
          icon: "MdFormatAlignJustify",
          title: "Stringify",
          description: "Converts a JSON object into a compact string format.",
          input: `{
  "name": "Alice",
  "city": "London"
}`,
          output: `{"name":"Alice","city":"London"}`,
        },
        {
          icon: "TbBandageFilled",
          title: "Escape",
          description: "Escapes special characters in a JSON string.",
          input: `{"text": "Hello \"world\""}`,
          output: `{"text": "Hello \\\"world\\\""}`,
        },
        {
          icon: "TbBandage",
          title: "Unescape",
          description: "Removes escape characters from a JSON string.",
          input: `{"text": "Hello \\\"world\\\""}`,
          output: `{"text": "Hello \"world\""}`,
        },
        //         {
        //           icon: "MdCode",
        //           title: "Map to JSON",
        //           description: "Converts a key-value pair formatted string to JSON.",
        //           input: `name=John, age=30, city=New York`,
        //           output: `{
        //   "name": "John",
        //   "age": 30,
        //   "city": "New York"
        // }`,
        //         },
        {
          icon: "LuClipboardCopy",
          title: "Copy",
          description: "Copies the formatted JSON to your clipboard for easy sharing.",
        },
        {
          icon: "AiOutlineSave",
          title: "Save",
          description: "Saves your JSON content locally or to a server if authenticated.",
        },
        {
          icon: "IoMdShare",
          title: "Share",
          description: "Generates a shareable link to your JSON content.",
        },
        {
          icon: "MdDeleteOutline",
          title: "Delete",
          description: "Removes the current JSON content from the editor.",
        }
      ],
    },
    {
      title: "FAQ",
      type: "faq",
      items: [
        {
          question: "How do I save my work?",
          answer: "Click the **Save** button to store your JSON locally.",
        },
        {
          question: "Do I lose my work if I don't save?",
          answer: "Yes, you will lose your work.",
        },
        {
          question: "How do I share my JSON?",
          answer: "Use the **Share** button to generate a shareable link.",
        },
        {
          question: "Is there an expiry for shared cards?",
          answer: "Yes, shared cards expire in 24 hours.",
        },
        {
          question: "Where do you store the data?",
          answer: "We store shared card data on our server without encryption, so please don't share any confidential information. The rest of the data is stored in your local storage.",
        },
        {
          question: "Can I delete my card?",
          answer: "Yes, clicking the **Delete** button will delete the card from the editor.",
        }
      ],
    },
  ],
};

export const blankSpaceHelpData = {
  title: "Blank Space",
  subtitle: "Learn how to use Blank Space for creative formatting.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdSpaceBar",
          title: "Add Spaces",
          description: "Allows you to add custom blank spaces between text elements.",
          input: `"Hello___World"`,
          output: `"Hello   World"`,
        },
      ],
    },
  ],
};

export const diffEditorHelpData = {
  title: "Diff Editor",
  subtitle: "Compare and edit differences between two text files.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdCompare",
          title: "Compare Files",
          description: "Highlights differences between two text files.",
          input: `"oldText": "Hello" vs "newText": "Hello World"`,
          output: `"Changes detected: 'World' added."`,
        },
      ],
    },
  ],
};

// Export all help data as an object
export const helpPages = {
  "jsonify": jsonifyHelpData,
  "blank-space": blankSpaceHelpData,
  "diff-editor": diffEditorHelpData,
};

