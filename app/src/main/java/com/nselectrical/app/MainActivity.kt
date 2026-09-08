package com.nselectrical.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nselectrical.app.ui.screens.*
import com.nselectrical.app.ui.theme.NSElectricalTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        setContent {
            NSElectricalTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    
                    NavHost(
                        navController = navController,
                        startDestination = "splash"
                    ) {
                        composable("splash") {
                            SplashScreen(
                                onNavigateToLogin = {
                                    navController.navigate("login") {
                                        popUpTo("splash") { inclusive = true }
                                    }
                                },
                                onNavigateToHome = {
                                    navController.navigate("home") {
                                        popUpTo("splash") { inclusive = true }
                                    }
                                }
                            )
                        }
                        
                        composable("login") {
                            LoginScreen(
                                onLoginSuccess = {
                                    navController.navigate("home") {
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            )
                        }
                        
                        composable("home") {
                            HomeScreen(
                                onNewDTR = { navController.navigate("dtr_form") },
                                onViewDTRList = { navController.navigate("dtr_list") },
                                onAddPole = { navController.navigate("add_pole") },
                                onViewPoleSchedule = { navController.navigate("pole_schedule") },
                                onOpenSettings = { navController.navigate("settings") }
                            )
                        }
                        
                        composable("dtr_form") {
                            DTRScreen(
                                onBack = { navController.popBackStack() },
                                onSaved = {
                                    navController.navigate("dtr_list") {
                                        popUpTo("dtr_form") { inclusive = true }
                                    }
                                }
                            )
                        }
                        
                        composable("dtr_list") {
                            DTRListScreen(
                                onBack = { navController.popBackStack() },
                                onAddDTR = { navController.navigate("dtr_form") },
                                onOpenPoleSchedule = { navController.navigate("pole_schedule") }
                            )
                        }
                        
                        composable("add_pole") {
                            AddPoleScreen(
                                onBack = { navController.popBackStack() },
                                onSaved = { navController.navigate("pole_schedule") }
                            )
                        }
                        
                        composable("pole_schedule") {
                            PoleScheduleScreen(
                                onBack = { navController.popBackStack() },
                                onAddPole = { navController.navigate("add_pole") }
                            )
                        }
                        
                        composable("settings") {
                            SettingsScreen(
                                onBack = { navController.popBackStack() },
                                onLogout = {
                                    navController.navigate("login") {
                                        popUpTo("home") { inclusive = true }
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
