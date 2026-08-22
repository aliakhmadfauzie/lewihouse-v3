package com.example.lewihouse.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = IndigoPrimary,
    onPrimary = LightBg,
    primaryContainer = IndigoDark,
    onPrimaryContainer = IndigoLight,
    secondary = AmberSecondary,
    onSecondary = LightBg,
    secondaryContainer = AmberDark,
    onSecondaryContainer = AmberLight,
    tertiary = EmeraldTertiary,
    onTertiary = EmeraldDark,
    tertiaryContainer = EmeraldDark,
    onTertiaryContainer = EmeraldLight,
    error = CoralError,
    errorContainer = CoralErrorLight,
    onError = LightBg,
    onErrorContainer = DarkBg,
    background = DarkBg,
    onBackground = DarkTextPrimary,
    surface = DarkSurface,
    onSurface = DarkTextPrimary,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkTextSecondary,
    outline = DarkTextSecondary
)

private val LightColorScheme = lightColorScheme(
    primary = IndigoPrimary,
    onPrimary = LightSurface,
    primaryContainer = IndigoLight,
    onPrimaryContainer = IndigoDark,
    secondary = AmberSecondary,
    onSecondary = LightSurface,
    secondaryContainer = AmberLight,
    onSecondaryContainer = AmberDark,
    tertiary = EmeraldTertiary,
    onTertiary = LightSurface,
    tertiaryContainer = EmeraldLight,
    onTertiaryContainer = EmeraldDark,
    error = CoralError,
    errorContainer = CoralErrorLight,
    onError = LightSurface,
    onErrorContainer = CoralError,
    background = LightBg,
    onBackground = LightTextPrimary,
    surface = LightSurface,
    onSurface = LightTextPrimary,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightTextSecondary,
    outline = LightBorder
)

@Composable
fun LewiHouseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
