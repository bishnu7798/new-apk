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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddPoleScreen(
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val context = LocalContext.current
    var poleNo by remember { mutableStateOf("P-01") }
    var poleType by remember { mutableStateOf("9.0 Meter PCC") }
    var routeLength by remember { mutableStateOf("45") }
    var staySet by remember { mutableIntStateOf(1) }
    var stayClamp by remember { mutableIntStateOf(1) }
    var earthSpike by remember { mutableIntStateOf(1) }
    var suspensionClamp by remember { mutableIntStateOf(1) }
    var deadEndClamp by remember { mutableIntStateOf(0) }
    var service1Ph by remember { mutableIntStateOf(4) }
    var service3Ph by remember { mutableIntStateOf(1) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pole Schedule Hardware", fontWeight = FontWeight.Bold, color = Color.White) },
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = poleNo,
                    onValueChange = { poleNo = it },
                    label = { Text("Pole Number") },
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
                    value = routeLength,
                    onValueChange = { routeLength = it },
                    label = { Text("Span Length (m)") },
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

            Text("HARDWARE & ACCESSORIES", color = Color(0xFF94A3B8), fontSize = 12.sp, fontWeight = FontWeight.Bold)

            HardwareCounterRow(title = "Stay Set Assembly", count = staySet, onAdd = { staySet++ }, onSub = { if (staySet > 0) staySet-- })
            HardwareCounterRow(title = "Stay Clamp (Type 1)", count = stayClamp, onAdd = { stayClamp++ }, onSub = { if (stayClamp > 0) stayClamp-- })
            HardwareCounterRow(title = "GI Earth Spike (3m)", count = earthSpike, onAdd = { earthSpike++ }, onSub = { if (earthSpike > 0) earthSpike-- })
            HardwareCounterRow(title = "Suspension Clamp", count = suspensionClamp, onAdd = { suspensionClamp++ }, onSub = { if (suspensionClamp > 0) suspensionClamp-- })
            HardwareCounterRow(title = "Dead End Clamp", count = deadEndClamp, onAdd = { deadEndClamp++ }, onSub = { if (deadEndClamp > 0) deadEndClamp-- })
            HardwareCounterRow(title = "1-Phase Service (Lt)", count = service1Ph, onAdd = { service1Ph++ }, onSub = { if (service1Ph > 0) service1Ph-- })
            HardwareCounterRow(title = "3-Phase Service (Lt)", count = service3Ph, onAdd = { service3Ph++ }, onSub = { if (service3Ph > 0) service3Ph-- })

            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = {
                    Toast.makeText(context, "Pole ${poleNo} added to Schedule!", Toast.LENGTH_SHORT).show()
                    onSaved()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Check, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save Pole to Schedule", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }
        }
    }
}

@Composable
fun HardwareCounterRow(title: String, count: Int, onAdd: () -> Unit, onSub: () -> Unit) {
    Card(
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(title, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)

            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = onSub,
                    modifier = Modifier.size(32.dp),
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Color(0xFF334155))
                ) {
                    Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = Color.White, modifier = Modifier.size(16.dp))
                }

                Text(
                    text = count.toString(),
                    color = Color(0xFF38BDF8),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.width(36.dp),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                IconButton(
                    onClick = onAdd,
                    modifier = Modifier.size(32.dp),
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Color(0xFF0284C7))
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Increase", tint = Color.White, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}
