// public/send.js
// TRUE AI — Frontend API Client


// --------------------------------------------------
// Send Message
// --------------------------------------------------
// Purpose:
// Send Discovery conversation data
// to the backend API.
//
// Used by:
// - index.html
// - Discovery flow
//
// Returns:
// {
//   reply,
//   phase,
//   state,
//   lifeprint
// }
// --------------------------------------------------

export async function sendMessage(

  phase = "TARGET",

  conversation = [],

  metadata = {}

) {

  try {

    const response =
      await fetch("/api/chat", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          phase,

          conversation,

          metadata
        })
      });


    // ----------------------------------------------
    // API Failure
    // ----------------------------------------------
    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "TRUE AI API error:",
        errorText
      );

      return {

        reply:
`Something interrupted the Discovery process.

Please try again in a moment.`,

        phase
      };
    }


    // ----------------------------------------------
    // Parse JSON
    // ----------------------------------------------
    const data =
      await response.json();


    // ----------------------------------------------
    // Validate Reply
    // ----------------------------------------------
    if (!data.reply) {

      return {

        reply:
`No reflective response was returned.`,

        phase
      };
    }


    // ----------------------------------------------
    // Success
    // ----------------------------------------------
    return {

      reply:
        data.reply,

      phase:
        data.phase || phase,

      state:
        data.state || null,

      lifeprint:
        data.lifeprint || null
    };

  } catch (error) {

    console.error(
      "TRUE AI sendMessage error:",
      error
    );

    return {

      reply:
`The Discovery experience is temporarily unavailable.

Please try again shortly.`,

      phase
    };
  }
}
