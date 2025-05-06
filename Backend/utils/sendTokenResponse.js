/**
 * Sends JWT token in HTTP-Only cookie + JSON body response.
 * Improves security by preventing JS access to cookie.
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateJWT();

  // 🧁 Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only over HTTPS
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // 🎁 Response
  res
    .cookie("token", token, cookieOptions)
    .status(statusCode)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

export default sendTokenResponse;
