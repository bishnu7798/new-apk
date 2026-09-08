package com.nselectrical.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Slate950 = Color(0xFF0B1120)
val Slate900 = Color(0xFF0F172A)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val CyanBlue = Color(0xFF0284C7)
val ElectricBlue = Color(0xFF38BDF8)
val EmeraldGreen = Color(0xFF10B981)

private val DarkColorScheme = darkColorScheme(
    primary = ElectricBlue,
    secondary = CyanBlue,
    tertiary = EmeraldGreen,
    background = Slate950,
    surface = Slate800,
    onPrimary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun NSElectricalTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography(),
        content = content
    )
}
