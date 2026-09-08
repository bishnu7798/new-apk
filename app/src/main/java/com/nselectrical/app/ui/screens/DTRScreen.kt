package com.nselectrical.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nselectrical.app.data.model.DTRRecord
import com.nselectrical.app.data.model.sampleDTRList

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DTRScreen(
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val context = LocalContext.current
    var dtrCode by remember { mutableStateOf("") }
    var village by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var capacity by remember { mutableStateOf("25 kVA") }
    var feeder by remember { mutableStateOf("11kV Rural Feeder-3") }
    var substation by remember { mutableStateOf("33/11kV Substation") }
    var block by remember { mutableStateOf("Ranaghat-I") }
    var division by remember { mutableStateOf("Nadia Division") }
    var gpsCoordinates by remember { mutableStateOf("23.1765° N, 88.5621° E (Acc: ±3m)") }
    var expandedCapacity by remember { mutableStateOf(false) }

    val capacities = listOf("16 kVA", "25 kVA", "63 kVA", "100 kVA", "250 kVA", "500 kVA")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("New DTR Survey", fontWeight = FontWeight.Bold, color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF0F172A))
            )
        },
        containerColor = Color(0xFF0B1120)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // GPS Location Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.MyLocation, contentDescription = null, tint = Color(0xFF38BDF8))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("GPS Survey Coordinates", color = Color(0xFF94A3B8), fontSize = 11.sp)
                        Text(gpsCoordinates, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                    Button(
                        onClick = {
                            gpsCoordinates = "23.1782° N, 88.5645° E (Acc: ±2m)"
                            Toast.makeText(context, "GPS Locked with High Precision!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text("Re-GPS", fontSize = 11.sp)
                    }
                }
            }

            // Form Fields
            OutlinedTextField(
                value = dtrCode,
                onValueChange = { dtrCode = it },
                label = { Text("DTR Code / ID (e.g. DTR-RN-104)") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp)
            )

            // Capacity Dropdown
            Box(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = capacity,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Transformer Rating / Capacity") },
                    trailingIcon = {
                        IconButton(onClick = { expandedCapacity = !expandedCapacity }) {
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Color.White)
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF38BDF8),
                        unfocusedBorderColor = Color(0xFF334155),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(10.dp)
                )

                DropdownMenu(
                    expanded = expandedCapacity,
                    onDismissRequest = { expandedCapacity = false },
                    modifier = Modifier.background(Color(0xFF1E293B))
                ) {
                    capacities.forEach { cap ->
                        DropdownMenuItem(
                            text = { Text(cap, color = Color.White) },
                            onClick = {
                                capacity = cap
                                expandedCapacity = false
                            }
                        )
                    }
                }
            }

            OutlinedTextField(
                value = village,
                onValueChange = { village = it },
                label = { Text("Village / Mouza Name") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp)
            )

            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text("Installation Landmark / Address") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp)
            )

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = block,
                    onValueChange = { block = it },
                    label = { Text("Block") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF38BDF8),
                        unfocusedBorderColor = Color(0xFF334155),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(10.dp)
                )

                OutlinedTextField(
                    value = division,
                    onValueChange = { division = it },
                    label = { Text("Division") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF38BDF8),
                        unfocusedBorderColor = Color(0xFF334155),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(10.dp)
                )
            }

            OutlinedTextField(
                value = feeder,
                onValueChange = { feeder = it },
                label = { Text("11kV Source Feeder") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Save Survey Button
            Button(
                onClick = {
                    if (dtrCode.isBlank() || village.isBlank()) {
                        Toast.makeText(context, "Please provide DTR Code and Village!", Toast.LENGTH_SHORT).show()
                    } else {
                        sampleDTRList.add(
                            DTRRecord(
                                id = System.currentTimeMillis().toString(),
                                dtrCode = dtrCode,
                                village = village,
                                location = location,
                                capacity = capacity,
                                feeder = feeder,
                                block = block,
                                division = division
                            )
                        )
                        Toast.makeText(context, "DTR Survey Saved Successfully!", Toast.LENGTH_LONG).show()
                        onSaved()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save & Add Poles", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}
